# Student Upload Pipeline Notes

**Last updated:** 2025-11-01

This document summarizes the 2025-11-01 fixes that allow the admin UI to add new students without transaction aborts when Cloudinary uploads misbehave. It also points future work to the relevant code paths.

## High-Level Behavior

1. **Initial validation (synchronous):** `student.service.ts#createStudent` now validates that 3–8 photos are attached *before* opening the MongoDB transaction. Failure returns immediately to the client.
2. **Transactional work (Mongo session):** Within the session we create:
   - `User` document for the student
   - `Student` document
   - Optional parent `User`/`Parent` (or link an existing one)
   - `UserCredentials` rows for both student and parent (when invoked by an admin)
   We commit the transaction before touching Cloudinary so database work is durable even if uploads stall.
3. **Cloudinary phase (post-commit):** After `commitTransaction`, we call `uploadPhotosToCloudinary` with retry/backoff settings. On success, we bulk-insert the resulting `StudentPhoto` docs outside the transaction.
4. **Cleanup on error:** If photo uploads or inserts fail after the transaction commits, the service now deletes: student + parent users, parent/student records, stored credentials, any `StudentPhoto` rows, and the already-uploaded Cloudinary assets to keep the system consistent.

## Key Files & Functions

| Location | Purpose |
| --- | --- |
| `backend/src/app/modules/student/student.service.ts` | `createStudent` orchestrates the entire flow (validation, DB session, Cloudinary handling, cleanup).
| `backend/src/app/utils/cloudinaryUtils.ts` | `uploadPhotosToCloudinary` performs uploads with configurable retries, timeouts, and concurrency; cleans up partial uploads.
| `backend/src/app/config/index.ts` | Supplies Cloudinary timeout/retry/concurrency values from `.env`.
| `frontend/src/services/api-base.ts` | API timeout increased so the React app waits for longer post-commit work.

## Configuration Knobs

Set these in `SMS-main_2/backend/.env` before starting the API to fine-tune Cloudinary behavior:

- `CLOUDINARY_UPLOAD_TIMEOUT` (default `120000` ms)
- `CLOUDINARY_UPLOAD_RETRIES` (default `3`)
- `CLOUDINARY_UPLOAD_CONCURRENCY` (default `3` parallel uploads)

Front-end timeout can be tuned via `VITE_API_TIMEOUT` (defaults to `180000` ms).

## How To Improve Upload Speed Later

- **Adjust concurrency:** Increase `CLOUDINARY_UPLOAD_CONCURRENCY` to upload more images simultaneously. Watch server CPU/memory and Cloudinary rate limits.
- **Tune retries:** If you see occasional timeouts, bump `CLOUDINARY_UPLOAD_RETRIES`; if uploads consistently succeed, reduce it to return errors faster.
- **Resize images client-side:** Compress images before they reach the backend to reduce upload time.
- **Background processing:** For heavier workloads, consider moving the Cloudinary phase into a queue worker and immediately acknowledging the request (spread over more work but adds complexity).

## Expected Cloudinary Folder Structure

We still rely on `generateCloudinaryFolderPath`, so folders look like:

```
SchoolName/Students/student@firstName@age@grade@section@bloodGroup@studentId
```

There were no format changes—existing Auto-Attend tooling continues to pick up student photos the same way.

## Cleanup Logic Reference

When Cloudinary or photo persistence fails post-transaction, `createStudent` now calls:

- `StudentPhoto.deleteMany({ studentId })`
- `Student.deleteOne({ _id: student._id })`
- `User.deleteOne({ _id: studentUserId })`
- `Parent.deleteOne({ _id: createdParentId })` (only for newly created parents)
- `User.deleteOne({ _id: parentUserId })` (only for new parent users)
- `Parent.updateOne({ _id: existingParentId }, { $pull: { children: studentId } })`
- `UserCredentials.deleteMany({ _id: { $in: storedCredentialIds } })`
- `deleteFromCloudinary(publicId)` for each uploaded asset

This ensures we leave no dangling references if Cloudinary fails after the DB transaction succeeds.

---

Keep this file in version control so future maintainers know where to modify the pipeline when optimizing performance or retry behavior.
