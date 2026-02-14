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

- [x] **Step 2.1: UserContext (Expanded)**
  - Create `context/UserContext.tsx`.
  - Define state for: `firstName`, `age`, `grade`, `subject`, `favoriteTeacher`, `teacherReason`, `hobby`, `initialProblem`.
  - Implement `UserProvider`.
- [x] **Step 2.2: Supabase Server Client**
  - Create `lib/supabase/server.ts` (for Server Components).
  - Create `lib/supabase/admin.ts` (using Service Role Key for Proxy).
- [x] **Step 2.3: AI Service Proxy (Refined)**
  - Create `app/api/chat/route.ts` (The Proxy).
  - Implement POST handler.
  - Initialize GoogleGenerativeAI with server-side key.
  - Implement system instruction injection based on UserContext data (persona, teacher style, and response length constraints).

## Phase 3: Onboarding UI (Wow Factor)

- [x] **Step 3.1: Landing Page**
  - Create `app/page.tsx` with a "Start" button and premium animations.
- [x] **Step 3.2: Onboarding Flow Wrapper & Multi-step Logic**
  - Create `app/onboarding/page.tsx`.
  - Implement Step Registry (Name -> Age -> Grade -> Subject -> Hobby -> Teacher -> Style -> Diagnostic).
  - Use Framer Motion `AnimatePresence` for smooth transitions.
- [x] **Step 3.3: Visual Persona Selection & Teacher Reason**
  - Create a rich UI for choosing the "Favorite Teacher".
  - Add the "Why me?" step where the teacher asks for the style (behavioral definition).
- [x] **Step 3.4: Diagnostic Question (Initial Problem)**
  - Add the final onboarding step where the selected teacher asks: "What's bothering you in [Subject] today?".

## Phase 4: Chat Interface (Mobile First)

- [x] **Step 4.1: Chat Layout**
  - Create `app/chat/page.tsx`.
  - Implement a mobile-first layout (fixed bottom input, scrollable message area).
- [x] **Step 4.2: Message Components**
  - Create `MessageBubble.tsx` (Inline in ChatPage for now).
  - Style User vs AI messages distinctively with Sender Names.
  - Integrate LaTeX rendering for math.
- [x] **Step 4.3: Chat Logic Integration**
  - Connect Chat UI to `app/api/chat/route.ts`.
  - Handle loading states (typing indicators).
  - Implement auto-scroll to bottom.
- [x] **Step 4.4: Vision/Image Upload**
  - Add camera/upload button to input area (multi-upload support).
  - Convert image to base64/blob + browser-side compression.
  - Update Proxy to handle multiple image parts in Gemini prompt.
  - Render sent images in Chat History for visual feedback.

## Phase 5: Analytics & Polish

- [x] **Step 5.1: Unique User Tracking**
  - Implement a `localStorage` based unique ID generation on the client.
  - Create a Supabase Proxy (`app/api/analytics/route.ts`) with "Upsert" logic.
  - Register the user in the `unique_users` table only once (per browser/identity).
- [x] **Step 5.2: Elegant Parent Feedback**
  - Add a clearly visible, pulsing "Heart" icon ❤️ in the header.
  - Implement a modal with a warm, personal message inviting parents to share ideas/feedback.
  - Log feedback entries to Supabase via the Analytics Proxy.
- [x] **Step 5.3: SEO & Metadata**
  - Configure Next.js Metadata API for beautiful social sharing (titles, descriptions). ✅
  - Add Favicon and App Icons. (Paths configured, manual icons recommended). ✅
- [x] **Step 5.4: Mobile Polish & Optimization**
  - Verify touch targets and button sizes for children's UI. ✅
  - Handle virtual keyboard focus/scroll behavior in the chat (h-[100dvh] & flex layout). ✅

## Phase 6: Final Review

- [x] **Step 6.1: Code Quality Check**
  - Remove any `console.log` used for debugging. ✅
  - Ensure strict TypeScript compliance. ✅
- [x] **Step 6.2: Security Verification**
  - Confirm NO secret keys are leaked to client logic. ✅
  - Verify RLS policies on Supabase (if tables are accessed directly). ✅

## Phase 7: Admin Dashboard (Secure)

- [ ] **Step 7.1: Admin Interface**
  - Create a hidden `/admin` route.
  - Implement a simple password-protected overlay/lock.
- [ ] **Step 7.2: Analytics Visualization**
  - Fetch anonymous usage stats from Supabase.
  - Display "Total Users" and "Total Sessions".
- [ ] **Step 7.3: Feedback Review**
  - Display parent feedback logs in a clean dashboard view.
