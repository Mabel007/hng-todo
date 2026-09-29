# HNG Todo

## Project structure

- `src/` contains application code.
- `src/components/` contains reusable presentational UI components.
- `src/hooks/` contains focused stateful hooks.
- `src/types.ts` contains shared domain types.
- `src/index.css` contains global styles and Tailwind layers.
- `public/` contains static assets only.
- Keep the app single-page and local-first; do not add a backend or global state library.

## Coding standards

- Use React 19, TypeScript, Vite, and Tailwind CSS.
- Prefer small, explicit components and typed props.
- Keep task state updates immutable and centralize persistence logic.
- Use semantic HTML and native controls where practical.
- Avoid unnecessary abstractions, dependencies, and premature optimization.
- Keep copy concise, friendly, and product-specific.
- Do not suppress TypeScript, ESLint, or build errors.

## UI expectations

- The interface should feel calm, polished, and useful at first glance.
- Prioritize the task composer, task list, filters, search, and completion progress.
- Support narrow mobile layouts and comfortable desktop layouts without horizontal scrolling.
- Use a restrained visual system: clear hierarchy, consistent spacing, strong contrast, and purposeful motion.
- Include useful empty states for no tasks, no search results, and no completed tasks.
- Avoid decorative UI that competes with the task workflow.

## Accessibility requirements

- Every interactive control must have an accessible name and a visible focus style.
- Use headings, landmarks, labels, and status messaging to communicate structure and updates.
- Ensure keyboard users can create, edit, complete, delete, search, filter, and clear tasks.
- Preserve sufficient color contrast and never rely on color alone to communicate state.
- Respect reduced-motion preferences for transitions and animation.
- Use confirmation or undo-friendly behavior for destructive actions when practical.

## Testing expectations

- Run the production build before completion.
- Run lint before completion and fix every error.
- Manually verify the core task flow: create, edit, complete/incomplete, delete, search, filters, clear completed, reload persistence, and responsive layout.
- Keep the code structured so focused component or hook tests can be added without refactoring the app.

## Git discipline

- Do not commit or push unless explicitly requested.
- Inspect the worktree before making changes and preserve unrelated user changes.
- Keep changes scoped to the requested app.
- Do not use destructive Git commands such as reset or checkout to discard work.

## Completion checks

Before declaring completion:

1. Confirm the app starts with the documented package script.
2. Confirm `npm run lint` passes.
3. Confirm `npm run build` passes.
4. Confirm localStorage persistence and all requested interactions work.
5. Confirm keyboard focus, semantic labels, and responsive behavior are present.
6. Confirm `git status` shows the implementation uncommitted and no unexpected generated files.
