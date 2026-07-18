# StudyMind AI 🧠✨

Welcome to **StudyMind AI**, a next-generation, AI-powered study companion designed to help you learn faster and more effectively. By leveraging cutting-edge Large Language Models (Google Gemini) and advanced RAG (Retrieval-Augmented Generation), StudyMind transforms any document into an interactive, personalized learning environment.

![StudyMind Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%7C%20LangChain%20%7C%20Gemini-blue)

---

## 🚀 Features

*   **📄 Intelligent Document Processing:** Upload any PDF, TXT, or Markdown file. The system chunks, vectorizes, and analyzes your material automatically.
*   **📝 Smart Summaries & Notes:** Instantly generate concise summaries and comprehensive study notes with beautiful Markdown formatting, bold headings, and lists.
*   **🗺️ Interactive Mind Maps:** Visualize complex topics with dynamically generated hierarchical mind maps (powered by Mermaid.js). Mind maps strictly focus on main headings for maximum readability.
*   **✅ AI Quizzes:** Test your knowledge! StudyMind creates custom multiple-choice quizzes based *only* on the contents of your document.
*   **💬 Chat with your Document (RAG):** Have a question? Chat directly with your document. The AI acts as your personal tutor, answering questions based exclusively on the uploaded context.
*   **📓 Personal Workspace:** A dedicated split-screen area to write your own personal notes and track Action Items/To-Dos linked to specific documents. All data is saved automatically to the cloud!
*   **💾 Multi-Format Export:** Found something useful? Instantly export your summaries, notes, mind maps, and quizzes to **TXT**, **PNG**, or **PDF**.
*   **🎨 Premium Aesthetics:** A stunning, modern UI built with Tailwind CSS, featuring glassmorphism, responsive mesh gradients, smooth framer-motion animations, and full Dark/Light mode support.

---

## 💻 Tech Stack

### Frontend
*   **React (Vite)**
*   **Tailwind CSS** (Premium styling, mesh gradients, custom scrollbars)
*   **Framer Motion** (Micro-animations and page transitions)
*   **React Router** (Navigation)
*   **React-Markdown & Remark-GFM** (Beautiful text formatting)
*   **html-to-image & jsPDF** (Exporting functionality)
*   **Mermaid.js** (Mind map rendering)

### Backend & AI
*   **Node.js & Express.js**
*   **MongoDB & Mongoose** (Database schema & storage)
*   **LangChain.js** (LLM orchestration and prompt engineering)
*   **Google Gemini API** (`gemini-2.5-flash` for high-speed generation, `gemini-embedding-2` for text embeddings)
*   **PDF-Parse & LangChain Text Splitters** (Document ingestion)

---

## 📸 Screenshots

*(Add your screenshots to the repository to display them here!)*

*   **Dashboard & Uploads:** Clean, drag-and-drop interface with recent activity tracking.
*   **Document View:** Multi-tabbed interface for Summaries, Notes, Chat, and Workspace.
*   **Settings & Preferences:** Full customization including Dark Mode toggles.
*   **Login & Authentication:** Secure and sleek user onboarding.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/purvashah-cmd/StudyMind-AI.git
cd StudyMind-AI
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your environment variables:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🧠 How it Works (Under the Hood)
When a document is uploaded, the Node.js backend uses `pdf-parse` to extract raw text, which is then passed through a LangChain `RecursiveCharacterTextSplitter`. These chunks are fed directly into the Gemini model's massive context window to generate accurate summaries, mind maps, quizzes, and answer conversational queries—completely mitigating hallucination and keeping the AI strictly focused on your material!

---

*Built with ❤️ for modern learners.*