# Schedule Management Feature Notes

**Last updated:** 2025-11-02

This note documents the schedule-management changes delivered in this session, contrasting old behaviour vs. new behaviour so future work can land quickly and safely.

## Summary

The admin schedule workflow now supports:
- Time-aware conflict detection (per teacher) across overlapping periods.
- Configurable multi-day creation ("apply to entire week") when creating a schedule.
- Copying an existing day’s routine to other days from the edit form.
- Frontend validation before submission (period overlaps, teacher conflicts, missing subjects/teachers).

All changes stay backward-compatible with the frontends that read `GET /schedules`, `GET /schedules/:id`, etc.

## Backend Changes

### What existed before
- `createSchedule` wrote **one** schedule per request and only prevented conflicts by comparing `periodNumber`, not actual time ranges.
- `updateSchedule` reused the same periodNumber-only conflict check, so overlapping times slipped through.
- No “apply to week” support; clients had to create each day manually.

### What’s new
- `schedule.interface.ts`: `ICreateScheduleRequest` now accepts `applyToDays` and `checkTeacherConflict` accepts start/end times (strings).
- `schedule.model.ts`: `checkTeacherConflict` now checks time overlaps, not just period numbers; pre-save validates time ordering and ensures no overlaps.
- `schedule.service.ts`:
  - `createSchedule` validates periods (overlaps, teacher double-booking, start/end order), then creates one or many schedules based on `applyToDays`.
  - `updateSchedule` runs the same validation path and normalises periods, preventing inconsistent state.
  - `assignSubstituteTeacher` and other callers pass the new start/end parameters when checking conflicts.
- `schedule.controller.ts`: returning an array when multiple schedules are created, with messaging still friendly for single-day usage.
- `scripts/clearSchedules.ts`: helper script to clear schedules per school (used in this session to reset test data).

## Frontend Changes (Admin UI)

### Previously
- `ScheduleManagement.tsx` offered per-day creation only; validations were minimal (no overlap/teacher clash checks).
- Editing a day required manual duplication to other days.

### Now
- Added client-side validation to prevent overlapping times, missing teachers/subjects, and teacher double-booking before hitting the API.
- "Apply this routine to the entire week" toggle (creation only) wraps the backend `applyToDays` support.
- Edit form includes a “Copy this routine to additional days” panel to replicate a finished schedule mid-week via single-day POSTs.
- Form reset (and modal close) now clears `applyToWeek` and `copyToDays` states.

## Testing & Scripts
- `npm run build` (backend & frontend) validate TypeScript/JSX changes.
- Run `npx ts-node scripts/clearSchedules.ts <schoolId>` when you need to wipe schedules for testing.

## Follow-up Ideas
- Surface conflict errors inline (e.g., highlight the offending period) instead of generic toast.
- Add batch deletion utilities or UI to clear weekly routines fast.
- Consider enabling copy-to-days during creation for arbitrary subsets (currently creation offers “entire week”, edit offers custom subset).

Keep this note updated if additional tweaks land so the next session knows where to start.
