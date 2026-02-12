---
name: Modern UI (Tailwind & Motion)
description: Guidelines for creating premium, animated UIs with Tailwind CSS and Framer Motion.
---

# Modern UI: Tailwind CSS & Framer Motion

## Overview

To achieve a "Wow" factor, the UI must be dynamic, responsive, and visually polished. This skill combines Tailwind CSS for styling and Framer Motion for animations.

## Tailwind CSS Best Practices

- **Utility-First:** Use utility classes for layout, spacing, and typography.
- **Configuration:** Extend `tailwind.config.ts` for custom colors (HSL), fonts, and animations.
- **Dark Mode:** Support `class` based dark mode for system preference or toggling.
- **Responsiveness:** Mobile-first approach (`<div class="block md:flex">`).

## Framer Motion (Motion) Patterns

### 1. Page Transitions

Wrap page content to animate route changes.

```jsx
// app/template.tsx or specialized layout wrapper
'use client';
import { motion } from 'framer-motion'; // or 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

### 2. Staggered Children (Onboarding Flow)

Orchestrate multiple elements appearing in sequence.

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.ul variants={container} initial='hidden' animate='show'>
  <motion.li variants={item}>Name</motion.li>
  <motion.li variants={item}>Age</motion.li>
</motion.ul>;
```

### 3. Interactive Elements

Add micro-interactions to buttons and cards.

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className='...'
>
  Start Learning
</motion.button>
```

## Shadcn/UI Integration

- **Components:** Use `npx shadcn-ui@latest add [component]` to add base components.
- **Customization:** Customize components in `components/ui` to match the design system (fonts, rounded corners, colors).
- **Composition:** Compose complex UIs from simple Shadcn primitives (Card, Button, Input).
