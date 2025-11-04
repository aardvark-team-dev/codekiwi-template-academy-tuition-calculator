
# Feature: 출결 상태 입력
> 관리자가 날짜별로 학생의 출결 상태(출석, 결석, 유계결석)를 기록하고, 유계결석 시 차감액을 관리합니다.

## Source
tasks.yaml - [US-003: 출결 상태 입력]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/attendance/page.tsx` - 날짜 선택 및 해당 날짜의 반별 출결 현황 UI

**Changes:**
- 기존 `attendance/page.tsx`의 Mock 데이터를 실제 API 연동으로 변경
- 날짜 선택 기능, 반별 아코디언 UI, 학생별 출결 상태(Radio Group) 입력 기능 구현
- 유계결석 시 차감액 자동 계산 및 수동 수정 기능 구현

### Backend

**New Domain: `attendance`**

**Types (`src/domain/attendance/types.ts`):**
- [ ] `AttendanceStatus` enum: `PRESENT`, `ABSENT`, `EXCUSED_ABSENT`
- [ ] `Attendance` interface: `id`, `studentId`, `classId`, `date`, `status`, `deductionAmount`
- [ ] DTOs for creation and updates.

**Repository (`src/domain/attendance/backend/AttendanceRepo.interface.ts` & `SqliteAttendanceRepo.ts`):**
- [ ] `saveAttendance(data)` - 여러 학생의 출결 정보를 한 번에 저장/수정 (UPSERT)
- [ ] `findAttendancesByDate(date)`
- [ ] `findAttendancesByStudent(studentId, month, year)`

**Service (`src/domain/attendance/backend/AttendanceService.ts`):**
- [ ] 비즈니스 로직 래퍼 (차감액 계산 등)

**API Routes:**
- [ ] `GET /api/attendance?date=YYYY-MM-DD` - 특정 날짜의 출결 정보 조회
- [ ] `POST /api/attendance` - 출결 정보 저장/수정

### Database Changes

- [x] **새 테이블: `attendances`**
  - `id` (TEXT, PK)
  - `student_id` (TEXT, FK to `students.id`)
  - `class_id` (TEXT, FK to `classes.id`)
  - `date` (TEXT NOT NULL) - `YYYY-MM-DD` 형식
  - `status` (TEXT NOT NULL) - `PRESENT`, `ABSENT`, `EXCUSED_ABSENT`
  - `deduction_amount` (INTEGER, DEFAULT 0)
  - `created_at` (TEXT, DEFAULT CURRENT_TIMESTAMP)
  - UNIQUE (`student_id`, `class_id`, `date`)

## Implementation Order

1.  **Database:** `scripts/reset-dev.ts`에 `attendances` 테이블 생성 스크립트 추가
2.  **Backend:** Types → Repository (Interface & Sqlite) → Service → API Routes 순서로 구현
3.  **Frontend:** `attendance` 페이지 수정 (Mock 데이터 제거 및 API 연동)

## Testing Checklist
- [ ] Lint 통과 및 Build 성공
- [ ] 날짜 선택 시 해당 날짜의 수업이 있는 반 목록이 정상적으로 표시되는지 테스트
- [ ] 학생별 출결 상태(출석/결석/유계결석)를 선택하고 저장하는 기능 테스트
- [ ] 유계결석 선택 시 차감액이 자동으로 계산되어 표시되는지 테스트
- [ ] 자동 계산된 차감액을 수동으로 수정하고 저장하는 기능 테스트
- [ ] 기존 출결 기록을 수정하고 저장하는 기능 테스트
