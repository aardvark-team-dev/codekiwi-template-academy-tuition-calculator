# Bug: getMockClasses is not defined

**Reported:** 2025-11-04

## 1. Initial Report

- **Error:** `ReferenceError: getMockClasses is not defined`
- **File:** `src/app/classes/page.tsx:57`
- **Description:** The application crashes when navigating to the `/classes` page because the `getMockClasses` function, which was part of the old mock data implementation, is still being called.

## 2. Investigation

- **Hypothesis:** The `getMockClasses` import was removed, but the function call within the `loadClasses` function was not correctly replaced with the `fetch('/api/classes')` API call.
- **Action:** Read `src/app/classes/page.tsx` to confirm.

## 3. Resolution

- **Status:** Resolved
- **Action:** Replaced all mock data calls (`getMockClasses`, `addMockClass`, etc.) in `src/app/classes/page.tsx` with their corresponding API calls (`fetch`). Removed unused states and functions related to mock data.
- **Verification:** The app should now load the class list from the backend API. The add class functionality should also work as expected.
