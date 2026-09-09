# Stat-ai — AI-Enabled Learning Platform

Smart India Hackathon 2026 prototype for competency gap analysis, targeted learning recommendations and AI-generated assessments.

## Technical stack

- Java 17
- Spring Boot 3.3.4 REST backend
- Spring AI + OpenAI for MCQ generation
- Apache OpenNLP 2.5.x for NLP analysis
- Apache Tika 3.3.x for document extraction
- Spring Data JPA
- H2 for the zero-setup MVP, with PostgreSQL/MySQL drivers available for deployment
- Optional Spring Security OAuth2 Resource Server for JWT/SSO integration
- React 18 + Vite production frontend
- Docker + Render deployment configuration

## Core workflow

1. Employee / role competency mapping
2. Rule-based competency gap analysis
3. Targeted iGOT-style course recommendations
4. Tika-based learning-material extraction
5. OpenNLP text analysis
6. Spring AI MCQ generation
7. Adaptive weighted quiz scoring and next-difficulty recommendation
8. Analytics dashboard

## API highlights

- `POST /api/gaps/analyze/{employeeId}`
- `GET /api/training/recommend/{employeeId}`
- `POST /api/materials/extract`
- `POST /api/materials/analyze`
- `POST /api/quiz/generate`
- `POST /api/adaptive/score`
- `GET /api/quiz/{id}`
- `GET /api/dashboard/overview`

## Frontend

The production UI lives in `frontend-react/` and is built with Vite. The Dockerfile builds the React app first and then packages its `dist/` output into the Spring Boot static resources, so Render serves the complete application from one web service.

For local frontend development:

```bash
cd frontend-react
npm install
npm run dev
```

Set `VITE_API_URL` only when the frontend needs to call a separate backend. In the deployed single-service build, the API is same-origin.

## Optional JWT/SSO

Authentication is intentionally disabled by default so the demo remains easy to run. Set `AUTH_ENABLED=true` and configure the Spring Security JWT issuer settings when connecting the platform to an approved identity provider/iGOT SSO environment.

## AI configuration

Set `OPENAI_API_KEY` in the deployment environment. Never commit API keys to GitHub.

The application falls back to deterministic mock quiz generation when the key is not configured, allowing the MVP to start without external AI credentials.
