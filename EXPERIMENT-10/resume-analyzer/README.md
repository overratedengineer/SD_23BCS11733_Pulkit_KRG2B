# ResumeIQ - AI Resume Analyzer

A sophisticated AI-powered fullstack web application for analyzing resumes against Job Descriptions (ATS Simulator).

## Features
- **Frontend**: Built with React 18, Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Built with Java 17, Spring Boot 3, Spring Security (JWT)
- **Database**: MongoDB
- **Parsing**: Apache Tika / PDFBox extracts text from PDFs and DOCX files.
- **Scoring Algorithm**: Matches extracted keywords to Target Job Descriptions. Generates scores and identifies missing critical skills.

## Quick Start (Docker)

Ensure you have Docker and Docker Compose installed.

1. Clone or download the repository.
2. In the root directory (`resume-analyzer`), run:
   ```bash
   docker-compose up --build
   ```
3. Access the Frontend at `http://localhost:80` (or `http://localhost` depending on setup).
4. Backend API runs on `http://localhost:8080/api`.

## Manual Start

### Backend (Spring Boot)
1. Ensure Java 17 and Maven are installed.
2. Ensure MongoDB is running locally on port 27017.
3. Open terminal in `backend/` folder.
4. Run `./mvnw spring-boot:run`.

### Frontend (React)
1. Open terminal in `frontend/` folder.
2. Run `npm install`
3. Run `npm run dev`
4. Access at `http://localhost:5173`

## Login
- Register a generic candidate user from the UI then login.

## Authors
- DeepMind Antigravity Pair-Programming Agent
