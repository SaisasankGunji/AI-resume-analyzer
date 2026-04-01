# 🧠 AI Resume Analyzer

An intelligent, full-stack resume screening web application powered by the **Cohere AI API**. Upload your resume and paste a job description to instantly receive an ATS compatibility score, actionable feedback, and missing keyword insights.

---

## 🚀 Live Demo

> _http://16.171.254.68:8000/ (Deployed using AWS EC2 instance)_

---

## ✨ Features

- 📄 **PDF Resume Upload** — Parses resume text directly from uploaded PDF files
- 🤖 **Cohere AI Analysis** — Uses Cohere's `command-a-03-2025` model to compare resume against job description
- 📊 **ATS Score** — Receive a 0–100 compatibility score with a visual indicator (Excellent / Good / Needs Improvement)
- 💬 **Actionable Feedback** — Bullet-by-bullet suggestions to improve your resume
- 🔑 **Missing Keywords** — Highlights skills and terms present in the job description but absent from your resume
- 🕓 **History** — View all previously analyzed resumes per user
- 🔐 **Authentication** — Google OAuth-based login with user profile support
- 🛡️ **Admin Panel** — Admin users can view all resume submissions across all users
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI framework |
| React Router DOM | Client-side routing |
| Material UI (MUI) | Component library & icons |
| Axios | HTTP client |
| CSS Modules | Scoped component styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Multer | PDF file upload handling |
| pdf-parse-new | PDF text extraction |
| Cohere AI SDK | Resume analysis via LLM |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Dashboard.module.css
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Sidebar.module.css
│   │   │   ├── History/
│   │   │   └── AlertMessage/
│   │   ├── utils/
│   │   │   ├── axios.js
│   │   │   ├── AuthContext.jsx
│   │   │   └── HOC/
│   │   │       └── withAuthHOC.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   │   ├── resume.js
│   │   └── user.js
│   ├── models/
│   │   ├── Resume.js
│   │   └── User.js
│   ├── routes/
│   │   ├── resume.js
│   │   └── user.js
│   ├── uploads/         # Temp PDF storage (auto-deleted after parsing)
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cohere API key](https://dashboard.cohere.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
```

Start the backend server:

```bash
node server.js
# or with nodemon
npx nodemon server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

---

## 🔌 API Endpoints

### User Routes — `/api/user`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register or login a user via Google OAuth data |

### Resume Routes — `/api/resume`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/add-resume` | Upload PDF + job description, returns AI analysis |
| `GET` | `/history/:user` | Get all resume analyses for a specific user |
| `GET` | `/admin/all` | Get all resume analyses (Admin only) |

---

## 🤖 How the AI Analysis Works

1. The uploaded PDF is parsed using `pdf-parse-new` to extract raw text.
2. The resume text and job description are injected into a structured prompt.
3. The prompt is sent to **Cohere's `command-a-03-2025`** model via the chat API.
4. The response is parsed to extract:
   - **ATS Score** — a numeric value from 0–100
   - **Missing Keywords** — comma-separated terms from the job description not found in the resume
   - **Suggestions** — line-by-line improvement recommendations
5. The result is saved to MongoDB and returned to the frontend.
6. The uploaded PDF is automatically deleted from the server after parsing.

---

## 🔐 Authentication Flow

- Users sign in via **Google OAuth** on the frontend.
- The user's `name`, `email`, and `photoUrl` from Google are sent to `/api/user/register`.
- If the user already exists, their record is returned. Otherwise, a new user is created.
- Auth state is managed globally via React `AuthContext`.

---

## 🌍 Environment Variables Reference

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | Backend | Port the Express server runs on |
| `MONGO_URI` | Backend | MongoDB connection string |
| `COHERE_API_KEY` | Backend | Your Cohere API key |

---

## 📸 Screenshots

> _Add screenshots of the Dashboard, Results, and History pages here._

---

## 🧩 Future Improvements

- [ ] Export analysis result as PDF report
- [ ] Support for `.docx` resume format
- [ ] Multiple job description comparisons side by side
- [ ] Resume improvement suggestions powered by AI rewriting
- [ ] Email notification when analysis is complete

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Cohere AI](https://cohere.com/) for the language model API
- [Material UI](https://mui.com/) for the component library
- [pdf-parse-new](https://www.npmjs.com/package/pdf-parse-new) for PDF text extraction

---

> Built with ❤️ by [Gunji Sai Sasank](https://github.com/your-username)
