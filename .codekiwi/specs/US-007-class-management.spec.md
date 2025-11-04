
# Feature: 반 관리 및 수업일수 설정
> 관리자가 반을 생성/관리하고, 월별 수업일수를 설정하여 수강료 계산의 기준을 마련합니다.

## Source
tasks.yaml - [US-007: 반 관리 및 수업일수 설정]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/classes/page.tsx` - 반 목록 조회, 새 반 생성 UI
- [ ] `src/app/classes/[id]/page.tsx` - 반 상세 정보, 소속 학생 관리, 월별 수업일수 설정 UI
- [ ] `src/components/class/ClassForm.tsx` - 반 생성/수정 폼
- [ ] `src/components/class/StudentManagement.tsx` - 학생 배정/해제 UI

**Changes:**
- 페이지 및 컴포넌트 신규 생성
- API 연동을 통해 반 관련 CRUD 기능 구현

### Backend

**New Domain: `class`**

**Types (`src/domain/class/types.ts`):**
- [ ] `Class` interface: `id`, `name`, `monthlyTuition`
- [ ] `MonthlyClassInfo` interface: `classId`, `year`, `month`, `totalLessons`
- [ ] `ClassStudent` interface: `classId`, `studentId`
- [ ] DTOs for creation and updates.

**Repository (`src/domain/class/backend/ClassRepo.interface.ts` & `SqliteClassRepo.ts`):**
- [ ] `createClass(data)`
- [ ] `findClassById(id)`
- [ ] `findAllClasses()`
- [ ] `addStudentToClass(classId, studentId)`
- [ ] `removeStudentFromClass(classId, studentId)`
- [ ] `findStudentsInClass(classId)`
- [ ] `setMonthlyInfo(data)`
- [ ] `getMonthlyInfo(classId, year, month)`
- [ ] `isStudentInClass(classId, studentId)`

**Service (`src/domain/class/backend/ClassService.ts`):**
- [ ] 비즈니스 로직 래퍼 (중복 학생 배정 방지 등)

**API Routes:**
- [ ] `POST /api/classes` - 새 반 생성
- [ ] `GET /api/classes` - 모든 반 조회
- [ ] `GET /api/classes/[id]` - 특정 반 상세 조회
- [ ] `POST /api/classes/[id]/students` - 학생을 반에 배정
- [ ] `DELETE /api/classes/[id]/students/[studentId]` - 학생을 반에서 제외
- [ ] `POST /api/classes/[id]/monthly-info` - 월별 수업일수 설정/수정

### Database Changes

- [x] **새 테이블: `classes`**
  - `id` (TEXT, PK)
  - `name` (TEXT NOT NULL)
  - `monthly_tuition` (INTEGER NOT NULL)
  - `created_at` (TEXT, DEFAULT CURRENT_TIMESTAMP)

- [x] **새 테이블: `class_students`** (학생-반 N:M 관계)
  - `class_id` (TEXT, FK to `classes.id`)
  - `student_id` (TEXT, FK to `students.id`)
  - `created_at` (TEXT, DEFAULT CURRENT_TIMESTAMP)
  - PRIMARY KEY (`class_id`, `student_id`)

- [x] **새 테이블: `monthly_class_info`**
  - `id` (TEXT, PK)
  - `class_id` (TEXT, FK to `classes.id`)
  - `year` (INTEGER NOT NULL)
  - `month` (INTEGER NOT NULL)
  - `total_lessons` (INTEGER NOT NULL)
  - `created_at` (TEXT, DEFAULT CURRENT_TIMESTAMP)
  - UNIQUE (`class_id`, `year`, `month`)

## Implementation Order

1.  **Database:** `scripts/reset-dev.ts`에 새 테이블 생성 스크립트 추가
2.  **Backend:** Types → Repository (Interface & Sqlite) → Service → API Routes 순서로 구현
3.  **Frontend:** `classes` 페이지 및 컴포넌트 구현

## Testing Checklist
- [ ] Lint 통과 및 Build 성공
- [ ] 새 반 생성 기능 테스트
- [ ] 학생을 반에 추가/제거하는 기능 테스트
- [ ] 월별 수업일수 설정 및 수정 기능 테스트
- [ ] 한 학생을 같은 반에 중복 추가 시 에러 처리 테스트
