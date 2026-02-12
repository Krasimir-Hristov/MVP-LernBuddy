---
name: Systematic Progress & Checkpoint Guard
description: Ensures the agent never rushes code and always waits for user approval between small steps.
---

# Systematic Progress & Checkpoint Guard

## Core Principle

NEVER binge-code. Implement in very small, atomic steps to ensure accuracy and alignment with the user's vision.

## Rules

1. **Atomic Steps**: Break down tasks into the smallest possible units (e.g., creating a single context file, or one UI component).
2. **Mandatory Checkpoints**: After completing EVERY sub-step, stop and report progress.
3. **Explicit Approval**: Before moving to the next step, explicitly ask: "Should I proceed with the next step ([Step Name])?"
4. **No Assumptions**: If any detail is ambiguous, stop and ask for clarification instead of guessing.
5. **Wait for Input**: Do not execute multiple successive steps from the implementation plan in a single turn.
