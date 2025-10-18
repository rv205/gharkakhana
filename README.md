GHAR KA KHANA - Full Project (Frontend + Backend)

This repository contains both the frontend (static site) and backend (Node.js + Express + MongoDB + Razorpay-ready).
Structure:
- frontend/ : static website (host on GitHub Pages, Netlify, Vercel)
- backend/ : Node.js + Express API (deploy to Render/Railway/Heroku)

Quick start (local):
- Frontend: open frontend/index.html or run `python -m http.server` inside frontend/
- Backend:
  cd backend
  cp .env.sample .env
  npm install
  npm run dev

Deploy:
- Push repo to GitHub
- Deploy backend to Render (connect repo), set env vars from backend/.env.sample
- Update frontend/script.js API_BASE to point to deployed backend /api URL, push frontend to GitHub Pages
