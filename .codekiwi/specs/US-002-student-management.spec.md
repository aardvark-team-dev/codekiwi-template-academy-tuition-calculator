
# Feature: 학생 등록
> 관리자가 학생 정보를 등록, 수정, 조회하고 반에 배정합니다.

## Source
tasks.yaml - [US-002: 학생 등록]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/students/page.tsx` - 학생 목록 조회, 새 학생 등록 UI
- [ ] `src/components/student/StudentForm.tsx` - 학생 생성/수정 폼

**Changes:**
- 기존 `students/page.tsx`의 Mock 데이터를 실제 API 연동으로 변경
- 학생 등록, 수정, 삭제 기능 구현

### Backend

**New Domain: `student`** (기존 `class` 도메인에 일부 포함되어 있었으나, 별도 도메인으로 분리/확장)

**Types (`src/domain/student/types.ts`):**
- [ ] `Student` interface (기존 `class` 도메인에서 이동)
- [ ] DTOs for creation and updates.

**Repository (`src/domain/student/backend/StudentRepo.interface.ts` & `SqliteStudentRepo.ts`):**
- [ ] `createStudent(data)`
- [ ] `findStudentById(id)`
- [ ] `findStudentByPhone(phone)`
- [ ] `findAllStudents()`
- [ ] `updateStudent(id, data)`
- [ ] `deleteStudent(id)`

**Service (`src/domain/student/backend/StudentService.ts`):**
- [ ] 비즈니스 로직 래퍼 (연락처 중복 방지, 형식 검증 등)

**API Routes:**
- [ ] `POST /api/students` - 새 학생 생성
- [ ] `GET /api/students` - 모든 학생 조회
- [ ] `GET /api/students/[id]` - 특정 학생 조회
- [ ] `PUT /api/students/[id]` - 학생 정보 수정
- [ ] `DELETE /api/students/[id]` - 학생 삭제

### Database Changes
- [x] **없음** - `US-007` 구현 시 `students` 테이블 이미 생성됨

## Implementation Order

1.  **Backend:** Types → Repository (Interface & Sqlite) → Service → API Routes 순서로 구현
2.  **Frontend:** `students` 페이지 및 컴포넌트 수정 (Mock 데이터 제거 및 API 연동)

## Testing Checklist
- [ ] Lint 통과 및 Build 성공
- [ ] 새 학생 등록 기능 테스트
- [ ] 학생 정보 수정 기능 테스트
- [ ] 학생 삭제 기능 테스트
- [ ] 중복된 연락처로 등록 시 에러 처리 테스트
- [ ] `010-XXXX-XXXX` 형식 이외의 연락처 등록 시 에러 처리 테스트
