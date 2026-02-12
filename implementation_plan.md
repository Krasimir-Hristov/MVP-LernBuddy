# LernBuddy Implementation Plan

This plan breaks down the development of the "LernBuddy" Socratic AI Tutor MVP into small, clear, and actionable steps.

## Phase 1: Setup & Foundation

- [x] **Step 1.1: Project Initialization**
  - Initialize Next.js 16 app (`npx create-next-app@latest`).
  - Configure Tailwind CSS.
  - Initialize Git repository.
- [x] **Step 1.2: Dependency Installation**
  - Install core libraries: `framer-motion` (or `motion`), `@supabase/supabase-js`, `@supabase/ssr`, `@google/generative-ai`.
  - Install UI libraries: `lucide-react`, `clsx`, `tailwind-merge`.
  - Install Latex support: `react-latex-next` (or 'katex').
- [x] **Step 1.3: Shadcn UI Setup**
  - Run `npx shadcn-ui@latest init`.
  - Install essential components: Button, Input, Card, Label, Textarea, ScrollArea, Avatar, Sheet (for mobile menu).
- [x] **Step 1.4: Environment Configuration**
  - Create `.env.local`.
  - Define variables: `NEXT_PUBLIC_SB_URL`, `NEXT_PUBLIC_SB_PUBLISHABLE`, `SB_SECRET`, `GEMINI_API_KEY`.
- [x] **Step 1.5: Folder Structure**
  - Set up `components/ui`, `components/features`, `lib/supabase`, `lib/ai`, `context`.

## Phase 2: State & Core Logic

- [ ] **Step 2.1: UserContext**
  - Create `context/UserContext.tsx`.
  - Define state for: `firstName`, `age`, `grade`, `subject`, `favoriteTeacher`, `hobby`.
  - Implement `UserProvider`.
- [ ] **Step 2.2: Supabase Server Client**
  - Create `lib/supabase/server.ts` (for Server Components).
  - Create `lib/supabase/admin.ts` (using Service Role Key for Proxy).
- [ ] **Step 2.3: AI Service Proxy**
  - Create `app/api/chat/route.ts` (The Proxy).
  - Implement POST handler.
  - Initialize GoogleGenerativeAI with server-side key.
  - Implement system instruction injection based on UserContext data (passed in request).

## Phase 3: Onboarding UI (Wow Factor)

- [ ] **Step 3.1: Landing Page**
  - Create `app/page.tsx` with a "Start" button and premium animations.
- [ ] **Step 3.2: Onboarding Flow Wrapper**
  - Create `components/features/onboarding/OnboardingFlow.tsx`.
  - Implement step management (Step 1 -> Step 2 -> ...).
- [ ] **Step 3.3: Form Steps (Animated)**
  - Create components for each step: `NameStep`, `AgeStep`, `PersonaStep`, etc.
  - Apply Framer Motion `AnimatePresence` for smooth transitions between steps.
- [ ] **Step 3.4: Persona Selection**
  - Create a visually rich selection for "Favorite Teacher" with avatars/icons.

## Phase 4: Chat Interface (Mobile First)

- [ ] **Step 4.1: Chat Layout**
  - Create `app/chat/page.tsx`.
  - Implement a mobile-first layout (fixed bottom input, scrollable message area).
- [ ] **Step 4.2: Message Components**
  - Create `MessageBubble.tsx`.
  - Style User vs AI messages distinctively.
  - Integrate LaTeX rendering for math.
- [ ] **Step 4.3: Chat Logic Integration**
  - Connect Chat UI to `app/api/chat/route.ts`.
  - Handle loading states (typing indicators).
  - Implement auto-scroll to bottom.
- [ ] **Step 4.4: Vision/Image Upload**
  - Add camera/upload button to input area.
  - Convert image to base64/blob.
  - Update Proxy to handle image parts in Gemini prompt.

## Phase 5: Analytics & Polish

- [ ] **Step 5.1: Analytics Proxy**
  - Create `app/api/analytics/route.ts`.
  - Log anonymous events to Supabase `events` table.
- [ ] **Step 5.2: Feedback System**
  - Add simple "Parent Feedback" button/modal.
  - Submit feedback via Analytics Proxy.
- [ ] **Step 5.3: SEO & Metadata**
  - Update `app/layout.tsx` metadata.
  - Add `manifest.json` for PWA capabilities (optional but recommended for mobile).
- [ ] **Step 5.4: Mobile Optimization Check**
  - Verify touch targets.
  - Verify input focus handling (virtual keyboard).

## Phase 6: Final Review

- [ ] **Step 6.1: Code Quality Check**
  - Remove any `console.log` used for debugging.
  - Ensure strict TypeScript compliance.
- [ ] **Step 6.2: Security Verification**
  - Confirm NO secret keys are leaked to client logic.
  - Verify RLS policies on Supabase (if tables are accessed directly).
