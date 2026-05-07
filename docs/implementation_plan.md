# Scholarship Copilot: Implementation Plan

This document tracks the detailed engineering tasks for building the Scholarship Application Copilot.

## Project North Star
Build a reliable, zero-hallucination AI system that automates the scholarship discovery and application process while maintaining the user's authentic voice through strategic "Human-in-the-loop" gates.

---

## ✅ Phase 1: Foundation & Infrastructure
- [x] **Tech Stack Initialization**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4 (Apple-inspired design).
- [x] **Database Setup**: Prisma 7 with PostgreSQL; custom `prisma.config.ts`.
- [x] **Authentication**: BetterAuth with `emailPassword` plugin and Prisma adapter.
- [x] **Email Integration**: Resend utility for transactional notifications.
- [x] **AI Core**: Gemini AI utility and Tavily search integration.

---

## 🏗️ Phase 2: User Profiles & Onboarding (In Progress)
- [x] **Schema**: `UserProfile` model for raw resume text and structured metadata.
- [x] **Server Actions**: `saveProfile` and `getProfile` for persistent user data.
- [/] **Onboarding UI**: Two-step flow for resume ingestion and preference setting.
    - [x] Resume Text Area
    - [x] Skills & Fields Input
    - [ ] AI-powered resume structuring (Post-ingestion refinement)

---

## 🏗️ Phase 3: Discovery & Extraction (The Scout)
- [x] **Scout Agent**: Tavily-powered search query generation and execution.
- [x] **Extractor Agent**: Gemini-powered structuring of raw scholarship web data.
- [x] **Scorer Agent**: Fit analysis comparing profile to scholarship requirements.
- [x] **Pipeline Orchestration**: `runScoutPipeline` server action.
- [x] **Dashboard UI**: prioritized list of matches with "Gate 1: Shortlist" capability.

---

## ✅ Phase 4: Preparation & Context (The Prep Agent)
*Goal: Identify what's missing and gather the "soul" of the application.*
- [x] **Agent Logic**: `identifyApplicationGaps` to find missing info/anecdotes.
- [x] **Gate 2 UI (Context Gathering)**:
    - [x] "Review Details" link in Dashboard.
    - [x] Interactive form asking the specific questions identified by the Prep Agent.
- [x] **State Update**: Transition application from `SCORED` to `READY_TO_DRAFT`.

---

## ✅ Phase 5: Generation & Refinement (The Drafter Agent)
*Goal: High-quality, fact-grounded drafting.*
- [x] **Drafter Agent**: Logic to generate essay drafts using profile + user context.
- [x] **Refiner Agent**: Critique and polish pass for final style alignment.
- [x] **State Update**: Transition to `REFINED`.

---

## ✅ Phase 6: Final Review & Submission (The Final Gate)
*Goal: User approval and record keeping.*
- [x] **Gate 3 UI (Final Editor)**:
    - [x] Side-by-side view: "Source Facts" vs. "Generated Essay".
    - [x] Rich text editor for final user tweaks.
- [x] **Submission Tracking**:
    - [x] Mark as "READY" and store the final version.

---

## 🚀 Phase 7: Automation & Polish
*Goal: Set it and forget it.*
- [ ] **Vercel Cron**: Scheduled daily scouting runs.
- [ ] **Daily Digest**: Resend email summary of the best new matches found.
- [ ] **UX Polish**: 
    - [ ] Apple-style micro-animations (Framer Motion).
    - [ ] Mobile-responsive layout refinement.
    - [ ] Error boundary handling for agent failures.

---

## Verification Plan

### Automated Tests
- [ ] **Agent Schema Tests**: Verify all agent JSON outputs via Zod.
- [ ] **Auth Flow Tests**: Ensure protected routes redirect to login.

### Manual Verification
- [ ] **The Hallucination Test**: Manually verify the first 10 drafts against the profile.
- [ ] **End-to-End Walkthrough**: From Signup -> Resume Upload -> Scout -> Context -> Final Draft.
