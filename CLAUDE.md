# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A comprehensive **School Management System (SMS)** built with MERN stack (MongoDB, Express, React, Node.js) supporting multi-school management with role-based access control, fee management, attendance tracking, and facial recognition integration.

**Version**: 1.0.0
**Status**: Production Ready (85%)
**Tech**: TypeScript, MongoDB, Express, React 18, TailwindCSS, shadcn/ui

## Development Commands

### Backend (`/backend`)

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Production
npm start:prod

# Database seeding
npm run seed              # Interactive seeder CLI
npm run seed:help         # Show seeding options
npm run migrate:address   # Add address to existing students

# Testing
npx ts-node comprehensive-system-test.ts    # Full system test
npx ts-node test-fee-models.ts              # Fee management tests
npx ts-node test-autoattend.ts              # Facial recognition API test
```

### Frontend (`/frontend`)

```bash
# Development server (Vite)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Utility Scripts

```bash
# Database diagnostics (run from /backend)
npx ts-node scripts/listActualData.ts        # List all DB contents
npx ts-node scripts/checkStudents.ts         # Check student data
npx ts-node scripts/diagnoseStudent.ts       # Debug specific student
npx ts-node scripts/getSchoolId.ts           # Get school ID
npx ts-node scripts/getAdminId.ts            # Get admin user ID

# Fee management utilities
npx ts-node scripts/seedFeeStructures.ts     # Seed fee structures
npx ts-node scripts/checkFeeRecords.ts       # Check fee records
npx ts-node scripts/fixFeeRecords.ts         # Fix fee record issues
npx ts-node scripts/updateStudentFeeRecords.ts  # Update fee records
```

## Architecture Overview

### Backend Module Pattern

**CRITICAL**: Every feature module follows this structure:

```
backend/src/app/modules/<feature>/
├── <feature>.interface.ts      # TypeScript interfaces and enums
├── <feature>.model.ts          # Mongoose schema/model
├── <feature>.validation.ts     # Zod validation schemas
├── <feature>.service.ts        # Business logic (pure functions)
├── <feature>.controller.ts     # HTTP request/response handlers
└── <feature>.route.ts          # Express route definitions
```

**Flow**: Route → Middleware (auth/validation) → Controller → Service → Model → Database

**Key Principles**:
- Services contain ALL business logic (no logic in controllers)
- Controllers only handle HTTP concerns (req/res)
- Validation happens at route level using `validateRequest()` middleware
- All async errors wrapped with `catchAsync()` utility

### Authentication & Authorization

**JWT + HTTP-only Cookies Architecture**:

```typescript
// Login flow
POST /api/auth/login → JWT token in HTTP-only cookie → Stored client-side

// Protected routes require TWO middlewares
router.use(authenticate);        // Verifies JWT, adds req.user
router.use(requireSuperadmin);   // Checks role (OR authorize(['admin', 'teacher']))
```

**User Roles Hierarchy** (6 roles):
1. `superadmin` - System-wide management, create schools
2. `admin` - School-specific management (students, teachers, fee structures)
3. `teacher` - Mark attendance, assign homework, record grades
4. `accountant` - Fee collection, payment tracking
5. `parent` - View children's data (read-only)
6. `student` - View own data (read-only)

**IMPORTANT**:
- Always use `authenticate` + `authorize([roles])` for protected routes
- Teacher context middleware (`addTeacherContext`) auto-injects `teacherId` and `schoolId` for teacher routes
- Multi-school isolation: ALL queries MUST filter by `schoolId`

### Fee Management System

**Complex 3-Model Architecture**:

1. **FeeStructure** - Admin creates templates (grade + academic year)
   - `feeComponents[]` - Monthly and one-time fees
   - `totalAmount` - Auto-calculated monthly total (excludes one-time)
   - Pre-save hook calculates totals

2. **StudentFeeRecord** - Individual student fee tracking
   - `totalFeeAmount` - (Monthly × 12) + One-time fees
   - `totalPaidAmount` - Sum of monthly + one-time paid
   - `totalDueAmount` - Auto-calculated via pre-save hook
   - `monthlyPayments[]` - Per-month payment tracking
   - `oneTimeFees[]` - Separate tracking for admission, books, etc.

3. **FeeTransaction** - Immutable payment history
   - `transactionId` - Unique: `TXN-timestamp-random`
   - Audit log with IP, device info

**CRITICAL Auto-Sync Logic**:
- When admin creates new FeeStructure, `feeCollection.service.ts::getStudentFeeStatus()` automatically updates student records
- Preserves all paid amounts, recalculates dues based on new structure
- First payment auto-includes ALL one-time fees (admission, books, etc.)

**Pre-save hooks** handle complex calculations - DO NOT manually calculate totals in services.

### Student ID Format

**Format**: `YYYYGGRRR` (10 digits, NO dashes)
- `YYYY` - Year (e.g., 2025)
- `GG` - Grade (01-12)
- `RRR` - Roll number (001-999)

**Example**: `2025101234` = Year 2025, Grade 10, Roll 1234

**Validation Regex**: `/^\d{10}$/`

**Auto-generation**: `student.service.ts::generateStudentId()` ensures uniqueness.

### Facial Recognition Integration (Auto-Attend)

**Architecture**:
- Each school has unique `apiKey` + `slug` (URL identifier)
- External camera app sends events to: `POST /api/attendance/:schoolSlug/events`
- **No JWT required** - uses API key header: `X-Attendance-Key: <school_api_key>`
- Events stored in `AttendanceEvent` collection
- Reconciliation compares camera data vs teacher manual attendance
- **Teacher attendance is ALWAYS authoritative** (camera only suggests)

**Key Files**:
- `backend/src/app/modules/attendance/autoattend.controller.ts`
- `backend/src/app/modules/attendance/attendance-event.model.ts`
- `backend/src/app/modules/attendance/autoattend-reconciliation.service.ts`

### Error Handling Pattern

**Global Error Handler** (`globalErrorHandler.ts`):
- Converts all errors to consistent JSON format
- Development: Full stack traces
- Production: User-friendly messages only

**Error Types Handled**:
- `AppError` - Custom application errors
- `ZodError` - Validation errors (from Zod schemas)
- `ValidationError` - Mongoose validation
- `CastError` - MongoDB casting errors
- `DuplicateKeyError` - Unique constraint violations

**Usage**:
```typescript
// Service layer
throw new AppError(httpStatus.NOT_FOUND, 'Student not found');

// Controllers - wrap async functions
export const getStudent = catchAsync(async (req, res) => {
  // If error thrown here, catchAsync forwards to global error handler
});
```

### Frontend Architecture

**Role-Based Component Structure**:
```
frontend/src/
├── components/
│   ├── admin/         # Admin-specific UI (fee structures, user mgmt)
│   ├── teacher/       # Attendance marking, homework assignment
│   ├── student/       # View-only student dashboard components
│   ├── parent/        # Parent portal (children monitoring)
│   ├── accountant/    # Fee collection UI
│   ├── superadmin/    # System-wide school management
│   ├── common/        # Shared components
│   └── ui/            # shadcn/ui base components
├── services/          # API layer (axios wrappers)
│   ├── api-base.ts    # Base axios instance with interceptors
│   ├── auth.api.ts    # Authentication APIs
│   ├── student.api.ts # Student management APIs
│   ├── fee.api.ts     # Fee management APIs
│   └── ...
├── context/
│   └── AuthContext.tsx  # Global auth state (user, token, role)
└── routes/
    └── AppRoutes.tsx  # Role-based routing with ProtectedRoute
```

**API Service Pattern**:
- All API calls in `/services/*.api.ts` files
- Never call axios directly from components
- `api-base.ts` handles auth headers, error interceptors

**Routing**:
- `<ProtectedRoute>` checks authentication
- `<RoleBasedRoute>` checks user role
- Unauthorized access redirects to login

## Environment Configuration

### Backend `.env`

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/school_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=8h

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=../storage

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Default Superadmin (created on first run)
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=super123
SUPERADMIN_EMAIL=superadmin@schoolmanagement.com
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Database Seeding

**Interactive CLI** (recommended):
```bash
cd backend
npm run seed
# Follow prompts to seed schools, users, students, teachers, etc.
```

**Seed Order** (if manual):
1. Schools
2. Users (admin, teacher, accountant)
3. Subjects
4. Students (auto-creates parent accounts)
5. Fee structures
6. Attendance/Homework (optional test data)

## Common Development Tasks

### Adding a New Feature Module

1. Create module directory: `backend/src/app/modules/<feature>/`
2. Follow the standard pattern (interface → model → validation → service → controller → route)
3. Register route in `backend/src/app/routes/index.ts`
4. Add API service in `frontend/src/services/<feature>.api.ts`
5. Create UI components in `frontend/src/components/<role>/<feature>/`

### Working with Fee System

**NEVER manually calculate fees** - Pre-save hooks handle this.

**If fee calculations are wrong**:
1. Check `feeStructure.model.ts` pre-save hook (monthly totals)
2. Check `studentFeeRecord.model.ts` pre-save hook (total paid/due)
3. Run: `npx ts-node scripts/checkFeeRecords.ts` to diagnose
4. Run: `npx ts-node scripts/fixFeeRecords.ts` to repair

### Creating a New User Role-Specific API

```typescript
// 1. Create route with auth + role check
router.get('/dashboard',
  authenticate,              // JWT validation
  authorize(['teacher']),    // Role check
  getDashboard              // Controller
);

// 2. Controller extracts user from req.user (added by auth middleware)
export const getDashboard = catchAsync(async (req, res) => {
  const userId = req.user._id;  // Available after authenticate
  const role = req.user.role;    // Available after authenticate
  // ... service call
});
```

### FormData Validation (File Uploads)

**Problem**: Zod validators fail with empty strings from FormData.

**Solution**: Use `z.preprocess()` to convert empty strings to undefined:

```typescript
// Example from homework.validation.ts
maxLateDays: z.preprocess(
  (val) => val === '' || val === null || val === undefined ? undefined : Number(val),
  z.number().min(1).max(30).optional()
),
```

## Testing

**Comprehensive Test Suite**:
```bash
cd backend
npx ts-node comprehensive-system-test.ts  # Full E2E backend test
```

**Test Coverage**:
- Database connectivity
- Authentication & JWT flows
- All CRUD operations
- Fee calculations (monthly + one-time)
- Role-based access control
- Multi-school isolation

**See**: `TESTING.md` for detailed testing guide.

## Important Files

### Backend Core
- `backend/src/app.ts` - Express app setup (middleware, CORS, routes)
- `backend/src/server.ts` - Server startup, DB connection
- `backend/src/app/config/index.ts` - Environment variable config
- `backend/src/app/DB/index.ts` - MongoDB connection singleton
- `backend/src/app/routes/index.ts` - Master route registry
- `backend/src/app/middlewares/auth.ts` - JWT authentication logic
- `backend/src/app/utils/catchAsync.ts` - Async error wrapper

### Fee Management (Complex)
- `backend/src/app/modules/fee/feeCollection.service.ts` - 500+ lines, core fee logic
- `backend/src/app/modules/fee/studentFeeRecord.model.ts` - Complex pre-save hooks
- `backend/src/app/modules/fee/accountantFee.controller.ts` - Payment collection APIs

### Student Management
- `backend/src/app/modules/student/student.service.ts` - Auto-generates credentials
- `backend/src/app/modules/student/student.model.ts` - Student schema with parent link

### Frontend Core
- `frontend/src/App.tsx` - Root component with AuthContext provider
- `frontend/src/context/AuthContext.tsx` - Global auth state
- `frontend/src/routes/AppRoutes.tsx` - Route definitions
- `frontend/src/services/api-base.ts` - Axios config with interceptors

## Known Issues & Workarounds

### Issue: TypeScript Errors After Git Pull
**Solution**:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Issue: MongoDB Connection Failed
**Solution**:
- Check MongoDB is running: `mongod` or `docker ps` (if using Docker)
- Verify `MONGODB_URI` in `.env`

### Issue: CORS Errors in Development
**Solution**:
- Frontend must run on `http://localhost:3000` or update `FRONTEND_URL` in backend `.env`
- Check `backend/src/app.ts` CORS configuration

### Issue: Fee Calculations Incorrect
**Solution**:
- Run diagnostic: `npx ts-node scripts/checkFeeRecords.ts`
- DO NOT manually edit fee records - use provided scripts or let pre-save hooks handle it

### Issue: Student ID Format Mismatch
**Updated Format**: 10 digits without dashes (`2025101234`)
- Old validation used dashes (`2025-10-123`) - deprecated
- Check regex: `/^\d{10}$/`

## Code Style Guidelines

**TypeScript**:
- Strict mode enabled
- Always define interfaces for data shapes
- Use enums for status fields (e.g., `PaymentStatus`, `AttendanceStatus`)
- Prefer `async/await` over promises

**Naming**:
- Files: `kebab-case` (e.g., `fee-collection.service.ts`)
- Classes/Interfaces: `PascalCase` (e.g., `StudentService`, `IStudent`)
- Functions: `camelCase` (e.g., `createStudent`, `calculateTotalFees`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)

**Error Handling**:
- Always use `catchAsync()` wrapper for async controllers
- Throw `AppError` with appropriate HTTP status codes
- Never catch errors in services - let them bubble to controller/error handler

## Security Considerations

**NEVER commit**:
- `.env` files
- `node_modules/`
- Database dumps with real data
- API keys or JWT secrets

**Best Practices Implemented**:
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens in HTTP-only cookies (XSS protection)
- Input validation with Zod schemas
- Rate limiting (100 req/min in production)
- Helmet.js for security headers
- CORS configured for specific origins
- Multi-school data isolation (always filter by `schoolId`)

## Production Deployment

**Pre-deployment Checklist**:
1. Run full test suite: `npx ts-node comprehensive-system-test.ts`
2. Check TypeScript compilation: `npm run build` (both frontend/backend)
3. Update `NODE_ENV=production` in backend `.env`
4. Set strong `JWT_SECRET` (min 32 chars, random)
5. Configure production `MONGODB_URI` (MongoDB Atlas)
6. Update `FRONTEND_URL` to production domain
7. Enable HTTPS/TLS
8. Set up reverse proxy (nginx recommended)
9. Configure PM2 or similar process manager

**Build Commands**:
```bash
# Backend
cd backend && npm run build
npm start  # Uses compiled dist/server.js

# Frontend
cd frontend && npm run build
# Deploy dist/ folder to static hosting (Vercel, Netlify, etc.)
```

## Documentation

- **README.md** - Project overview, setup instructions
- **backend/README.md** - Comprehensive backend documentation
- **TESTING.md** - Testing guide
- **AUTO_ATTEND_INTEGRATION_COMPLETE.md** - Facial recognition API guide
- **SECURITY.md** - Security policy (generic template)

## Recent Updates

**October 2025**:
- Fixed homework validation with FormData preprocessing
- Resolved TypeScript compilation errors across all services
- Updated student ID format to 10-digit standard
- Enhanced authentication flow with HTTP-only cookies
- Completed Auto-Attend facial recognition integration

**Status**: Core features complete, production-ready with 85% readiness for 5,000-15,000 users.

## Contact

For questions or issues, refer to the GitHub repository or contact the development team.

**Built by**: Abu Horaira ([@Ahnabu](https://github.com/Ahnabu)) & Habibur Rahman ([@habib-153](https://github.com/habib-153))
