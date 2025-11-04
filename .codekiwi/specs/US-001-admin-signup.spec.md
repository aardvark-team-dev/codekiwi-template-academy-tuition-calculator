# Feature: 관리자 회원가입
> 관리자가 이메일과 비밀번호로 시스템에 가입합니다.

## Source
tasks.yaml - [US-001: 관리자 회원가입]

## Implementation Scope

### Frontend
**Pages/Components:**
- [x] `src/app/signup/page.tsx` - 회원가입 UI 및 API 연동

**Changes:**
- Mock data 제거 → API 연동
- 하드코딩된 로직 제거 → 실제 로직으로 변경

### Backend

**간단한 기능:**
- [x] `src/app/api/auth/register/route.ts` - 기존 `UserService` 직접 호출
  - Endpoint: `POST /api/auth/register`
  - Request: `{ email: string, password: string }`
  - Response: `{ id: string, email: string, name: string | null }`

### Database Changes
- [x] **없음** - 기존 `users` 테이블 사용

## Implementation Order
1. API Route (`src/app/api/auth/register/route.ts`) 생성
2. Frontend (`src/app/signup/page.tsx`) 수정 (mock 제거 → API 연동)

## Testing Checklist
- [ ] Lint 통과
- [ ] Build 성공
- [ ] 회원가입 성공 시나리오 테스트
- [ ] 중복 이메일 가입 시 에러 처리 테스트
- [ ] 비밀번호 8자 미만 시 에러 처리 테스트
