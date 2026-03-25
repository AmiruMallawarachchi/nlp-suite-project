---
title: Multi-Task NLP Intelligence Suite
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Multi-Task NLP Intelligence Suite

A powerful, unified NLP application featuring a **FastAPI** backend powering 5 Hugging Face pipelines (Summarization, Sentiment, Zero-Shot, NER, QA) and a stunning **Next.js** frontend.

## Architecture
- **Backend**: FastAPI (Python), utilizing Hugging Face Transformers. 
- **Frontend**: Next.js (React), designed with modern UI principles.

---

## 🚀 Deployment Guide (100% Free)

### 1. Backend: Hugging Face Spaces
Hugging Face Spaces offers free CPU environments perfect for hosting this FastAPI application.

**Steps to Deploy:**
1. Create a free account at [Hugging Face](https://huggingface.co/join).
2. Go to your Profile -> "New Space".
3. Name your space (e.g., `nlp-suite-backend`).
4. Select **Docker** as the SDK and **Blank** as the Docker template.
5. Set the hardware to the free tier (e.g., CPU Basic - 2 vCPU · 16 GB).
6. Click "Create Space".
7. Clone the new Space repository locally and copy all files from this project (including the `Dockerfile`, `app/`, and `requirements.txt`) into it.
8. Commit and push the files to the Hugging Face Space repository.
9. Hugging Face will automatically build the Docker image and deploy the API.

> Note: The `Dockerfile` in this repo is already pre-configured for Hugging Face Spaces (exposing port `7860`).

### 2. Frontend: Vercel
Vercel is the creator of Next.js and provides excellent free hosting (Hobby Tier).

**Steps to Deploy:**
1. Update your Next.js frontend components to point to the deployed Hugging Face Space URL.
2. Push your `frontend` code or the entire project to a free GitHub repository.
3. Log in to [Vercel](https://vercel.com/) with your GitHub account.
4. Click "Add New..." -> "Project".
5. Import your GitHub repository.
6. Set the Framework Preset to **Next.js** and the Root Directory to `frontend`.
7. Click "Deploy". Vercel will automatically build and host the highly responsive web interface for free.

---

## Local Development

### Run the FastAPI Backend
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
