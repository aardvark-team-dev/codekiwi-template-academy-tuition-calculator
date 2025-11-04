# Bug: Failed to add class

**Reported:** 2025-11-04

## 1. Initial Report

- **Error:** `Error: Failed to add class`
- **File:** `src/app/classes/page.tsx:111`
- **Description:** When trying to create a new class from the UI, the request to `POST /api/classes` fails, and the browser console shows a generic "Failed to add class" error.

## 2. Investigation

- **Hypothesis:** The frontend is sending the request, but the backend API route is throwing an unhandled exception. The most likely place for the error is within the `SqliteClassRepo.createClass` method, as it involves database insertion and then a subsequent select.
- **Action:** Check the server logs (`app.log`) for a more specific error message originating from the `POST /api/classes` route.

## 3. Resolution

- **Status:** Resolved
- **Action:** 
  1. Added `console.error` to the `catch` block in `src/app/api/classes/route.ts` for better error visibility.
  2. Modified `SqliteClassRepo.createClass` to use `RETURNING id` instead of `lastInsertRowid` to correctly retrieve the ID of the newly inserted class. The `id` is a `TEXT` field with a default random value, making `lastInsertRowid` unreliable.
- **Verification:** The "Add Class" functionality should now work correctly. The backend will properly insert the new class and return its data.
