import React, { useState, useEffect, useRef } from 'react';
import './ChatAI.css';

const ChatAI = ({ onSwitchToView }) => {
    // --- State Declarations ---
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeThread, setActiveThread] = useState(null); 
    
    // FIX: New state to manage the authentication token dynamically
    const [sessionToken, setSessionToken] = useState(null); 

    // --- EFFECT 0: Read Token on Mount/Focus ---
    useEffect(() => {
        const checkToken = () => {
            const storedToken = localStorage.getItem('authToken');
            setSessionToken(storedToken);
        };
        
        checkToken(); // Initial check

        window.addEventListener('storage', checkToken);
        window.addEventListener('focus', checkToken);

        return () => {
            window.removeEventListener('storage', checkToken);
            window.removeEventListener('focus', checkToken);
        };
    }, []); 

    // --- Helper Functions ---
    const createThreadTitle = (text) => {
        const words = text.trim().split(/\s+/);
        return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : text;
    };
    
    const switchActiveThread = (threadToActivate) => {
        setActiveThread(threadToActivate);
        setMessage('');
        setResponse('');
    };

    // ----------------------------------------------------
    // NEW: Logout Handler Function
    // ----------------------------------------------------
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        setSessionToken(null);               // Update state immediately
        setHistory([]);                      // Clear history UI
        switchActiveThread(null);            // Clear chat panel
        onSwitchToView('home');              // Navigate to a non-chat view (or login)
    };


    // 1. FIXED EFFECT: Load Thread History (Dependency now on sessionToken)
    useEffect(() => {
        if (!sessionToken) {
            setHistory([]);
            setActiveThread(null);
            return;
        }

        const loadHistory = async () => {
            try {
                const resThreads = await fetch('http://localhost:3000/api/chat/threads', {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                });

                if (!resThreads.ok) throw new Error('Failed to fetch threads list');
                const dataThreads = await resThreads.json();
                
                const rawThreads = Array.isArray(dataThreads) ? dataThreads : dataThreads.threads || [];
                const threads = rawThreads.map(thread => ({
                    ...thread,
                    id: String(thread.id) 
                }));
                
                setHistory(threads);

                if (threads.length > 0) {
                    switchActiveThread(threads[0]);
                } else {
                    switchActiveThread(null);
                }

            } catch (err) {
                console.error('History load error:', err);
                setHistory([]); 
                setActiveThread(null);
            }
        };
        
        loadHistory();
        
    }, [sessionToken]);


    // 2. FIXED EFFECT: Load Messages for Active Thread 
    useEffect(() => {
        if (!sessionToken || !activeThread) {
            return;
        }
        
        if (activeThread.messages.length > 0) {
            return;
        }

        const fetchThreadMessages = async (threadId) => {
            try {
                const res = await fetch(`http://localhost:3000/api/chat/threads/${threadId}`, {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                const loadedMessages = data.messages || [];

                setActiveThread(prev => ({
                    ...prev,
                    messages: loadedMessages
                }));

                setHistory(prevHistory => prevHistory.map(thread => 
                    thread.id === threadId 
                        ? { ...thread, messages: loadedMessages }
                        : thread
                ));

            } catch (err) {
                console.error('Failed to load thread messages:', err);
            }
        };
        
        fetchThreadMessages(activeThread.id);
        
    }, [activeThread?.id, sessionToken]);


    // 3. handleSend Function
    const handleSend = async () => {
        if (!message.trim()) return;

        if (!sessionToken) {
            setResponse("Error: Authentication required. Please log in.");
            return;
        }
        
        setLoading(true);
        setResponse('');
        const userMessage = message; 

        let currentThread = activeThread;
        let isNewThread = false;
        
        if (!currentThread) {
            isNewThread = true;
            const newThreadId = Date.now().toString(); 
            const newTitle = createThreadTitle(userMessage); 
            currentThread = { 
                id: newThreadId, 
                title: newTitle, 
                messages: [] 
            };
        }

        const updatedMessages = [...currentThread.messages, { sender: 'user', content: userMessage }];
        
        setActiveThread(prev => ({ 
            ...(prev || currentThread), 
            messages: updatedMessages 
        }));
        
        if (isNewThread) {
            setHistory(prev => [currentThread, ...prev]);
        }

        setMessage('');
        
        try {
            const res = await fetch('http://localhost:3000/api/chat/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }) 
                },
                body: JSON.stringify({ 
                    message: userMessage, 
                    threadId: currentThread.id 
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMsg = errorData.details || errorData.message || `HTTP error! Status: ${res.status}`;
                throw new Error(errorMsg);
            }

            const data = await res.json();
            const aiReply = data.reply || 'No response';
            setResponse(aiReply);
            
            const newAIMessage = { sender: 'ai', content: aiReply };
            
            setActiveThread(prev => {
                const newActiveThread = {
                    ...prev,
                    messages: [...updatedMessages, newAIMessage]
                };
                setHistory(prevHistory => prevHistory.map(thread => 
                    thread.id === currentThread.id ? newActiveThread : thread
                ));
                return newActiveThread;
            });
            
        } catch (err) {
            console.error('Chat error:', err);
            setActiveThread(prev => ({
                ...prev,
                messages: prev.messages.slice(0, -1)
            }));
            setResponse(`Error: ${err.message || 'Something went wrong.'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // 4. Other Handlers and Render
    const handleNewChat = () => {
        setActiveThread(null);
        setResponse('');
    };
    
    const handleDeleteThread = async (e, threadId) => {
        e.stopPropagation(); 
        
        if (!window.confirm("Are you sure you want to delete this thread and all its messages?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/chat/threads/${threadId}`, {
                method: 'DELETE', 
                headers: { Authorization: `Bearer ${sessionToken}` } 
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMsg = errorData.message || `HTTP error! Status: ${res.status}`;
                throw new Error(errorMsg);
            }

            setHistory(prevHistory => prevHistory.filter(thread => thread.id !== threadId));

            if (activeThread && activeThread.id === threadId) {
                switchActiveThread(null);
            }

        } catch (err) {
            console.error('Failed to delete thread:', err);
            setResponse(`Error deleting thread: ${err.message || 'Something went wrong.'}`);
        }
    };
    
    const handleThreadClick = (thread) => {
        switchActiveThread(thread); 
    };
    
    const currentMessages = activeThread ? activeThread.messages : [];

    
    // Conditional rendering based on sessionToken
    if (!sessionToken) {
        return (
            <div className="chat-ai-page-container unauthorized">
                <p>Please log in to your account to access Krishi Sahayak chat.</p>
                <button className="new-chat-button" onClick={() => onSwitchToView('login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="chat-ai-page-container">
            <header className="chat-header">
                <div className="chat-logo">
                    <button className="chat-back-button" onClick={() => onSwitchToView('home')}>←</button>
                    <span className="logo-icon">🌱</span> Krishi Sahayak
                </div>
                <div className="user-profile">
                    <span className="notification-bell">🔔</span>
                    {/* MODIFIED: Added functional Logout Button */}
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                    <div className="profile-avatar"></div>
                </div>
            </header>

            <main className="chat-main-layout">
                {/* Left Panel: Thread History (GPT Style) */}
                <aside className="chat-history-panel">
                    <button className="new-chat-button" onClick={handleNewChat}>+ New Chat</button>
                    <h3 className="panel-title">Your Threads</h3>
                    <ul className="chat-threads-list">
                        {history.length === 0 ? (
                            <li className="thread-entry empty">Start a new conversation!</li>
                        ) : (
                            history.map((thread) => (
                                <li 
                                    key={thread.id} 
                                    className={`thread-entry ${activeThread && activeThread.id === thread.id ? 'active' : ''}`}
                                    onClick={() => handleThreadClick(thread)} 
                                >
                                    <span className="thread-title-text">{thread.title}</span>
                                    <button 
                                        className="thread-delete-button"
                                        onClick={(e) => handleDeleteThread(e, thread.id)}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </aside>

                {/* Right Panel: Active Chat Interaction (Bubbles in the middle) */}
                <section className="chat-interaction-panel">
                    
                    {/* Active Conversation Messages Container */}
                    <div className="chat-message-history">
                        
                        {currentMessages.length === 0 && (
                            <div className="chat-main-content-wrapper">
                                <img src="/logo.png" alt="Krishi Sahayak Logo" className="chat-page-logo" />
                                <div className="welcome-bubble">
                                    <p>നിങ്ങളുടെ ചോദ്യങ്ങൾ ചോദിക്കൂ, ഞാൻ സഹായിക്കാൻ തയ്യാറാണ്.</p>
                                    <p className="translation">(Ask your questions, I'm ready to help.)</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Render actual messages */}
                        {currentMessages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`chat-message-container ${msg.sender === 'user' ? 'user' : 'ai'}`}
                            >
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        
                        {/* Display loading state */}
                        {loading && (
                            <div className="chat-message-container ai loading">
                                <div className="message-bubble">Loading...</div>
                            </div>
                        )}
                        
                    </div>
                    
                    {/* Controls Wrapper at the bottom */}
                    <div className="chat-controls-wrapper">
                        <div className="chat-controls">
                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക..."
                                />
                                <button className="send-button" onClick={handleSend} disabled={loading || !message.trim()}>
                                    {loading ? '...' : '➤'}
                                </button>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-speak">🎤 Speak</button>
                                <button className="btn-upload">🖼 Upload Image</button>
                            </div>
                        </div>
                        
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ChatAI;