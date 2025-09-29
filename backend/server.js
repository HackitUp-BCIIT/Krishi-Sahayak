// server.js

// 1. Core Imports
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const multer = require('multer');
require('dotenv').config();

// 2. Gemini SDK Import
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// --- CRITICAL FIX: API Key Check ---
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    process.exit(1); 
}

// 3. Initialize Gemini Client 
const ai = new GoogleGenAI({});

// --- MySQL Connection Pool (remains the same) ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log(` Connected to MySQL: ${process.env.DB_NAME}`);
        conn.release();
    })
    .catch(err => {
        console.error(' MySQL connection failed:', err.message);
    });

// --- Global Middleware (remains the same) ---
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());

// --- FIXED JWT Middleware ---
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // CRITICAL FIX 1: Ensure userId exists in the decoded token
            if (!decoded.userId) {
                console.error('JWT Decode Error: Token is valid but missing userId.');
                return res.status(401).json({ message: 'Token missing user identification.' });
            }
            
            // Map userId (from token) to id (for consistency in req.user)
            req.user = { 
                id: decoded.userId, 
                name: decoded.name, 
                email: decoded.email 
            };
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    }
    return res.status(401).json({ message: 'No token provided.' });
};

// --- Auth Routes (remain the same) ---
app.post('/api/auth/register', async (req, res) => {
    // ... (logic remains the same)
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ message: 'Email already registered.' });

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, password_hash]);
        const token = jwt.sign({ userId: result.insertId, email, name }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'Registered successfully.', token, user: { id: result.insertId, name, email } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    // ... (logic remains the same)
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) return res.status(401).json({ message: 'User not found.' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ message: 'Incorrect password.' });

        const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login successful.', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// --- Protected Routes (remain the same) ---
app.get('/api/profile', protect, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}`, user: req.user });
});

// --- GET Chat Threads List ---
app.get('/api/chat/threads', protect, async (req, res) => {
    const userId = req.user.id; 
    
    if (!userId || typeof userId !== 'number' || userId <= 0) {
         return res.status(401).json({ message: 'Authentication failed: Invalid User ID for database query.' });
    }
    
    try {
        const [threads] = await pool.query(`
            SELECT 
                t1.thread_id,
                t1.message AS title,
                t1.timestamp AS created_at
            FROM chat_history t1
            INNER JOIN (
                SELECT thread_id, MIN(timestamp) AS min_timestamp
                FROM chat_history
                WHERE user_id = ?
                GROUP BY thread_id
            ) t2 ON t1.thread_id = t2.thread_id AND t1.timestamp = t2.min_timestamp
            ORDER BY t1.timestamp DESC
        `, [userId]);

        const formattedThreads = threads.map(thread => ({
            id: thread.thread_id,
            title: thread.title,
            messages: [] 
        }));

        res.json(formattedThreads);

    } catch (err) {
        console.error('Threads fetch error:', err);
        res.status(500).json({ message: 'Failed to fetch chat threads.', details: err.message });
    }
});

// --- GET Messages for a Single Thread ---
app.get('/api/chat/threads/:threadId', protect, async (req, res) => {
    const userId = req.user.id;
    const { threadId } = req.params;
    
    if (!threadId) return res.status(400).json({ message: 'Thread ID required.' });
    
    if (!userId || typeof userId !== 'number' || userId <= 0) {
         return res.status(401).json({ message: 'Authentication failed: Invalid User ID for database query.' });
    }
    
    try {
        const [rows] = await pool.query(`
            SELECT message, response 
            FROM chat_history 
            WHERE user_id = ? AND thread_id = ?
            ORDER BY timestamp ASC
        `, [userId, threadId]);

        const messages = rows.flatMap(row => [
            { sender: 'user', content: row.message },
            { sender: 'ai', content: row.response }
        ]);

        res.json({ id: threadId, messages });

    } catch (err) {
        console.error('Thread messages error:', err);
        res.status(500).json({ message: 'Failed to fetch thread messages.', details: err.message });
    }
});


// --- DELETE Thread Endpoint (NEW) ---
app.delete('/api/chat/threads/:threadId', protect, async (req, res) => {
    const userId = req.user.id;
    const { threadId } = req.params;

    if (!userId || typeof userId !== 'number' || userId <= 0) {
        return res.status(401).json({ message: 'Authentication failed: Invalid User ID.' });
    }
    if (!threadId) {
        return res.status(400).json({ message: 'Thread ID required for deletion.' });
    }
    
    try {
        // Delete all messages associated with this thread_id AND user_id
        const [result] = await pool.query(
            'DELETE FROM chat_history WHERE user_id = ? AND thread_id = ?', 
            [userId, threadId]
        );

        // result.affectedRows will be the total number of rows (user message + AI response) deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Thread not found or already deleted.' });
        }

        res.status(200).json({ message: `Thread ${threadId} deleted successfully.` });

    } catch (err) {
        console.error('Thread delete error:', err);
        res.status(500).json({ message: 'Failed to delete thread.', details: err.message });
    }
});


// 4. MODIFIED ROUTE: Text Generation using Google Gen AI SDK
app.post('/api/chat/text', protect, async (req, res) => {
    const userId = req.user.id;
    const userMessage = req.body.message; 
    const threadId = req.body.threadId; 
    
    if (!userMessage || !threadId) {
        return res.status(400).json({ message: 'Message and threadId fields are required.' });
    }

    if (!userId || typeof userId !== 'number' || userId <= 0) {
         return res.status(401).json({ message: 'Authentication failed: Invalid User ID for database query.' });
    }

    try {
        // SDK Call
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: userMessage, 
        });

        const reply = response.text || 'No response generated.';

        // Save to chat history with the thread_id
        await pool.query(
            'INSERT INTO chat_history (user_id, thread_id, message, response) VALUES (?, ?, ?, ?)', 
            [userId, threadId, userMessage, reply]
        );

        res.json({ reply });
    } catch (err) {
        console.error('Gemini Text error:', err);
        res.status(500).json({ 
            message: 'Gemini Text API failed.',
            details: err.message
        });
    }
});


// --- Image Upload for Gemini Vision (remain the same) ---
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/chat/image', protect, upload.single('image'), async (req, res) => {
    const userId = req.user.id;
    const imageBuffer = req.file?.buffer;
    const prompt = req.body.prompt || "Describe this image."; 
    const threadId = req.body.threadId;

    if (!imageBuffer || !threadId) return res.status(400).json({ message: 'Image file and threadId required.' });

    if (!userId || typeof userId !== 'number' || userId <= 0) {
         return res.status(401).json({ message: 'Authentication failed: Invalid User ID for database query.' });
    }

    try {
        // Helper function to convert buffer to Part object
        const imagePart = (mimeType, buffer) => ({
            inlineData: {
                data: buffer.toString('base64'),
                mimeType
            }
        });

        // SDK Call for Multimodal
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                imagePart(req.file.mimetype, imageBuffer),
                prompt 
            ]
        });
        
        const reply = response.text || 'No response generated.';

        // Save to history with the thread_id
        await pool.query(
            'INSERT INTO chat_history (user_id, thread_id, message, response) VALUES (?, ?, ?, ?)', 
            [userId, threadId, `[Image: ${prompt}]`, reply]
        );
        res.json({ reply });

    } catch (err) {
        console.error('Gemini Vision error:', err);
        res.status(500).json({ 
            message: 'Gemini Vision API failed.',
            details: err.message
        });
    }
});

// --- 5. Catch-all 404 Handler (remain the same) ---
app.use((req, res) => {
    res.status(404).json({
        message: '404 Not Found',
        details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist. Check your API route.`
    });
});


app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});