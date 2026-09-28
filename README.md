# Hands-On Activity 1: Attendance Tracker

**Objective:** Practice `useState`, `useEffect` with cleanup, and lifting state up.
**Suggested time:** 45 minutes

## How to run
1. Open this folder in VS Code (**File → Open Folder…**).
2. Double-click `start.bat`, **or** open the terminal with **Ctrl + `** and run:
   ```
   npm install
   npm run dev
   ```
3. The app opens at http://localhost:5173. Press **Ctrl + C** in the terminal to stop it.

> If PowerShell says *"running scripts is disabled on this system"*, click the **˅** arrow beside the **+** in the terminal panel and choose **Command Prompt**, then run the same commands.

## Your tasks
Search the project for `TODO` (**Ctrl + Shift + F**). The styling is already done, so you only need to write the React logic.

| # | Task | File |
|---|------|------|
| 1 | Create a `present` state that starts at 0 (class size `TOTAL = 40`). | `src/App.jsx` |
| 2 | Write `handleAdd` / `handleRemove` in App and pass them as props to `<AttendanceControls>`. The count must never go below 0 or above 40. Disable the buttons at the limits. | `src/App.jsx`, `src/components/AttendanceControls.jsx` |
| 3 | Show present, absent, and the attendance rate in percent. | `src/components/AttendanceSummary.jsx` |
| 4 | Use `useEffect` so the browser tab title shows `Present: X/40` whenever `present` changes. | `src/App.jsx` |
| 5 | Make `<LiveClock>` tick every second with `setInterval`, and clear it in a cleanup function. | `src/components/LiveClock.jsx` |
| Bonus | Add a working **Reset** button that uses the functional update form. | `src/App.jsx`, `AttendanceControls.jsx` |

## Expected result
- Clicking **+ Present** raises Present and the rate; Absent goes down.
- **+ Present** is disabled at 40, **− Present** is disabled at 0.
- The browser tab reads `Present: 12/40` (for example).
- The clock updates every second.

## Rubric (100 pts)
| Criterion | Points |
|---|---|
| Buttons and limits work | 30 |
| State lifted to App correctly (children have no own state) | 30 |
| `useEffect` for the title + interval with cleanup | 25 |
| Readable code and naming | 15 |

## Submit
A screenshot of the running app **and** your zipped `src` folder (do not include `node_modules`) or a GitHub repository link.
