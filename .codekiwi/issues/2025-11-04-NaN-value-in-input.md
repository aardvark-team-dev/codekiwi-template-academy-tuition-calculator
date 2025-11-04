# Bug: Received NaN for the `value` attribute in MonthlyInfoManagement

**Reported:** 2025-11-04

## 1. Initial Report

- **Error:** `Received NaN for the `value` attribute.`
- **File:** `src/components/class/MonthlyInfoManagement.tsx:49`
- **Description:** When viewing the class detail page (`/classes/[id]`), an input field in the `MonthlyInfoManagement` component receives `NaN` as its value, causing a React warning.

## 2. Investigation

- **Hypothesis:** The `totalLessons` state is being set to `NaN`. This likely happens in the `onChange` handler when the input field is cleared, causing `parseInt('')` which results in `NaN`.
- **Action:** Read `src/components/class/MonthlyInfoManagement.tsx` to confirm the state handling for the `totalLessons` input.

## 3. Resolution

- **Status:** Resolved
- **Action:** Modified the `onChange` handlers for the number inputs in `MonthlyInfoManagement.tsx`. Used `parseInt(e.target.value) || 0` to ensure that if the input is cleared (resulting in an empty string), the state is set to `0` instead of `NaN`. Also added a fallback to an empty string for the `value` prop (`value={totalLessons || ''}`) to prevent the warning even if `NaN` somehow gets into the state.
- **Verification:** The warning should no longer appear, and clearing the input fields should not cause any errors.
