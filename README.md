<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=DIGITEFA%20Platform&fontSize=60&fontAlignY=35&desc=Next-Gen%20AI-Powered%20Job%20Portal&descAlignY=55&descAlign=50" />
</div>

<div align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&style=for-the-badge">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=for-the-badge">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white&style=for-the-badge">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge">
</div>

<br />

<div align="center">
  <strong>DIGITEFA</strong> is a high-end, premium Job Portal platform engineered with a robust microservices architecture. It seamlessly integrates a modern frontend, a clean-architecture backend, and a dedicated AI service for semantic vector-based job recommendations.
</div>

---

## 🚀 Architecture At a Glance

The DIGITEFA platform is split into three core, independent services communicating seamlessly to deliver a world-class user experience.

- **`frontend/` (Next.js 14)**: The user-facing application built with App Router, tailored for a cinematic and smooth experience. Styled with Tailwind CSS, globally managed with Zustand, and form-validated with React Hook Form.
- **`backend/` (NestJS)**: The core API Gateway and Business Logic hub. Engineered following strict **Clean Architecture** principles to separate Domain, Use Cases, Interface Adapters, and Infrastructure. Manages authentication, job CRUD, and communicates with the AI service.
- **`ai-service/` (FastAPI)**: A dedicated Python microservice leveraging `sentence-transformers` and PyTorch. It processes text into multidimensional embeddings and computes cosine-similarity vector matching via PostgreSQL's `pgvector`.
- **Database**: A single powerful PostgreSQL instance loaded with the `pgvector` extension, orchestrated via Docker.

---

## 🧠 Clean Architecture in Backend

Our backend is meticulously crafted to be decoupled and scalable.
- **Domain Layer**: Enterprise business rules and Prisma entity mapping.
- **Use Case Layer**: Application-specific logic (e.g., `ApplyForJobUseCase`).
- **Interface Adapters**: Controllers and DTOs formatting data for external delivery.
- **Infrastructure**: Outermost layer housing Prisma Client, Auth Guards, and external API connectors.

_For more details, see [`clean-architecture.md`](./clean-architecture.md)._

---

## ✨ AI Similarity Matching

DIGITEFA goes beyond keyword search. When jobs or talents are created, the `ai-service` generates dense vector embeddings. During a search or recommendation request, it performs mathematical similarity matching (`find_top_matches`) to intelligently connect the right candidates with the right roles in milliseconds.

---

## 🛠️ Getting Started

DIGITEFA is fully containerized for a smooth developer experience. Make sure you have **Docker** and **Docker Compose** installed.

### 1. Spin up the Infrastructure
To start the entire stack (PostgreSQL + pgvector, Backend, Frontend, and AI Service), simply run:
```bash
docker-compose up --build
```

### 2. Manual Setup (Local Development)

#### Database
```bash
docker-compose up db -d
```
Runs a local PostgreSQL instance with `pgvector` on port `5432`.

#### AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Docs available at `http://localhost:8000/docs`.

#### Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
Runs on port `3000`. Ensure your `.env` is configured with `DATABASE_URL` pointing to the local DB.

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Runs on port `3001` (or `3000` if backend is on a different port). Ensure `NEXT_PUBLIC_API_URL` points to your NestJS backend.

---

## 🚢 Deployment Strategy

The deployment plan mandates multi-stage Dockerfiles for each service.
- **Frontend**: `.next/standalone` optimized build.
- **Backend**: Precompiled `dist/main.js` execution.
- **AI Service**: Lightweight `python:3.10-slim` with Uvicorn.

_For comprehensive orchestration configurations, consult [`deployment-plan.md`](./deployment-plan.md)._

---

<div align="center">
  <i>Engineered for Performance • Designed for Experience • Powered by AI</i>
</div>
