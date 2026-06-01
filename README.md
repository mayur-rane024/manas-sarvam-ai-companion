# Manas

**Anonymous, multilingual mental health support chatbot for India.**

Manas is a mobile-first mental health companion that helps users talk through difficult moments in a safe, private, and culturally aware way. It combines anonymous onboarding, Supabase-backed chat history, Sarvam AI responses, Mayura translation, and crisis-aware UX to make emotional support more accessible across Indian languages.

Built as a hackathon project with a strong focus on responsible AI, India-first language support, and production-ready frontend engineering.

## GitHub Description

Anonymous multilingual mental health support chatbot for India, powered by Sarvam AI, Mayura translation, React, Vite, and Supabase.

## Suggested Repository Name

`manas-ai-companion`

Other good options:

- `manas-mental-health-chatbot`
- `manas-sarvam-ai`
- `manas-support-companion`

## Why Manas

Many people hesitate to seek support because of stigma, language barriers, privacy concerns, or the pressure of explaining everything at once. Manas reduces that first step. It lets users start anonymously, answer a few gentle onboarding questions, and chat with a companion that responds in short, supportive, culturally aware language.

Manas is not a replacement for therapy or emergency care. It is designed as a low-friction emotional support layer that can listen, encourage reflection, and surface crisis resources when needed.

## Core Features

- **Anonymous access**: no name, phone number, or email required.
- **Guided onboarding**: captures age range, mood, preferred language, prior support history, and current concerns.
- **Sarvam AI chat**: generates concise support responses with an India-focused system prompt.
- **Mayura translation**: translates replies into the user's preferred Indian language.
- **Language-aware fallback**: detects selected or inferred language for more natural responses.
- **Crisis detection**: flags self-harm keywords and shows iCall support information.
- **Persistent history**: stores user profiles and chat messages in Supabase.
- **Mobile-first UI**: clean, calm interface optimized for small screens.
- **Demo-safe mode**: app still opens even when Supabase credentials are not configured.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Routing | React Router |
| UI Icons | Lucide React |
| Localization | i18next, react-i18next |
| Backend Services | Supabase Auth, Supabase Database |
| AI | Sarvam AI |
| Translation | Mayura |
| Tooling | ESLint |

## Architecture

```text
User
  -> React onboarding flow
  -> Anonymous Supabase session
  -> User profile and chat history
  -> Sarvam AI chat completion
  -> Mayura translation when needed
  -> Crisis-aware chat UI
```

## How Sarvam AI Is Used

Manas uses Sarvam AI for conversational support with a system prompt tailored for Indian users. The prompt asks the model to:

- reply directly in the user's preferred language,
- keep responses short and emotionally grounded,
- understand Romanized Hindi, Marathi, slang, and local dialect patterns,
- avoid diagnosis or medical prescription,
- include iCall support information when self-harm is mentioned.

Mayura translation is used to translate generated responses into supported Indian languages when the preferred language is not English.

## Safety Design

Mental health apps need careful boundaries. Manas includes:

- crisis keyword detection,
- an always-visible crisis banner when risk is detected,
- iCall helpline information,
- non-diagnostic system prompting,
- short supportive responses instead of clinical claims,
- graceful fallback replies when the AI response is unavailable.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SARVAM_API_KEY=your_sarvam_api_key
VITE_SARVAM_MODEL=sarvam-30b
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql`.
4. Enable anonymous sign-ins in Supabase Auth.
5. Add your Supabase URL and anon key to `.env`.

## Deployment

Recommended settings for Vercel, Netlify, or similar platforms:

```text
Build command: npm run build
Output directory: dist
```

Required environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SARVAM_API_KEY
VITE_SARVAM_MODEL
```

## Project Structure

```text
src/
  components/
    chat/
    onboarding/
    ui/
  lib/
    i18n.js
    supabase.js
  locales/
    en.json
    hi.json
  pages/
    ChatPage.jsx
    OnboardingPage.jsx
supabase/
  schema.sql
```

## Current Status

- Production build passes.
- ESLint passes.
- npm audit reports no high-severity vulnerabilities.
- `.env` is ignored and `.env.example` is safe to commit.

## Important Note

Manas is a support companion, not a substitute for licensed therapy, medical advice, or emergency services. If a user is in crisis, the app surfaces iCall at `9152987821`.
