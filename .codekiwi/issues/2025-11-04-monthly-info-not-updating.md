# Bug: Monthly class info does not update in UI after save

**Reported:** 2025-11-04

## 1. Initial Report

- **URL:** `http://localhost:3000/classes/[id]`
- **Action:** In the `MonthlyInfoManagement` component, change the `total_lessons` for a specific month and click "Save".
- **Problem:** The UI does not reflect the updated number of lessons. The input field reverts to its previous value or `0`.

## 2. Investigation

- **Hypothesis 1 (Frontend):** The `handleSave` function in `MonthlyInfoManagement.tsx` successfully sends the data, but the subsequent call to `fetchMonthlyInfo()` does not correctly update the component's state to reflect the new value.
- **Hypothesis 2 (Backend):** The `POST /api/classes/[id]/monthly-info` API endpoint is not correctly performing the UPSERT operation in the `monthly_class_info` table.
- **Action:** Use Playwright to simulate the user's actions. Inspect the `POST` request and its response, and check the browser console for errors. Simultaneously, check the server logs (`app.log`) for any database errors during the `POST` request processing.

## 3. Resolution

- **Status:** In Progress

## 4. Follow-up Issue: `useCallback` Error

**Reported:** 2025-11-04

- **Error:** User reported a `useCallback` related error after the previous fix.
- **Hypothesis:** The dependency array for the `useCallback` hook in `MonthlyInfoManagement.tsx` is likely incomplete. The `fetchMonthlyInfo` function depends on `year` and `month` to build the fetch URL, but they were probably omitted from the `useCallback` dependency array, causing a stale closure and a React Hook lint error.
- **Action:** Read `src/components/class/MonthlyInfoManagement.tsx` to verify and correct the dependency array.

## 5. Resolution

- **Status:** In Progress

## 6. Follow-up Issue: `useCallback is not defined`

**Reported:** 2025-11-04

- **Error:** `ReferenceError: useCallback is not defined`.
- **Hypothesis:** The `useCallback` hook was used in `MonthlyInfoManagement.tsx`, but it was not imported from the `react` package.
- **Action:** Read `src/components/class/MonthlyInfoManagement.tsx` and add `useCallback` to the import statement from `react`.

## 7. Resolution

- **Status:** In Progress

## 8. Follow-up Issue: Save button is unresponsive

**Reported:** 2025-11-04

- **Error:** Clicking the "Save" button does nothing; the UI does not update, and no feedback is given.
- **Hypothesis:** The `POST` request in `handleSave` is being sent, but the backend logic for updating an *existing* record in `SqliteClassRepo.setMonthlyInfo` is flawed. The `UPDATE` statement might not be executing correctly, and the subsequent `fetchMonthlyInfo` call in the frontend re-fetches the old, unchanged data, making it seem like nothing happened.
- **Action:** Use Playwright to click the save button and inspect the network tab for the `POST` request and the subsequent `GET` request. Check the server logs for any errors during the `POST` request.

## 9. Resolution

- **Status:** In Progress
