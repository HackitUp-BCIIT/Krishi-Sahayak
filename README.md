# Krishi Sahayak - Smart Farming Solutions

## 🌿 Project Overview

Krishi Sahayak is a full-stack web application designed to empower farmers with essential tools and information, including secure user authentication and an AI-powered chatbot for real-time agricultural advice.

This project is built with:
* **Frontend:** React (Vite) with for a modern, responsive user interface.
* **Backend:** Node.js (Express) handling API requests, database interactions, and business logic.
* **Database:** MySQL for storing user data.
* **Authentication:** Clerk.dev for secure and scalable user management (login, signup, social logins).
* **AI Chatbot:** Google Gemini API for providing intelligent agricultural advice.

## ✨ Features

* **User Authentication:**
    * Secure Email/Password registration and login.
    * Seamless social logins via Google, Facebook (managed by Clerk.dev).
    * Protected routes for authenticated users.
    * User profile management (provided by Clerk.dev UI components).
* **AI-Powered Chatbot:**
    * Interactive chatbot powered by Google Gemini for quick agricultural guidance.
    * Backend-driven API integration for secure LLM key management.
* **Farmer Profile Management (Planned/Expandable):**
    * (Future features could include displaying user-specific farming data, historical advice, etc.)
* **Modern UI/UX:**
    * Responsive design using Tailwind CSS.
    * Intuitive forms for user interactions.

## 🚀 Getting Started

Follow these steps to get your Krishi Sahayak project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js & npm:** [Download Node.js](https://nodejs.org/) (npm is included).
* **MySQL Server:** [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
* **Git:** [Download Git](https://git-scm.com/downloads).
* **Clerk.dev Account:** [Sign up for a free Clerk.dev account](https://clerk.com/signup).
* **Google Gemini API Key:** [Get your Gemini API Key](https://ai.google.dev/generative-ai/docs/get-started).

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-name> # e.g., cd SIH
