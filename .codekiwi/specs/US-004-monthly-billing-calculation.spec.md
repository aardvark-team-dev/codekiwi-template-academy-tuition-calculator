
# Feature: 월별 수강료 자동 계산
> 관리자가 유계결석을 반영한 정확한 청구 금액을 실시간으로 조회할 수 있습니다.

## Source
tasks.yaml - [US-004: 월별 수강료 자동 계산]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/billing/page.tsx` - 월별 청구 내역 조회 UI

**Changes:**
- Mock 데이터 제거 → 실제 API 연동
- `getMockStudents`, `getMockClasses`, `getMockMonthlyBillings` 제거
- `getStudentTotalFee` 로직은 유지 (UI 계산용)
- UI/UX 디자인 최대한 보존

### Backend

**New Domain: `billing`**

**Types (`src/domain/billing/types.ts`):**
- [ ] `MonthlyBilling` interface
  ```typescript
  interface MonthlyBilling {
    studentId: string
    studentName: string
    month: string // YYYY-MM
    baseAmount: number // 정액 수강료 (모든 반의 월 수강료 합계)
    presentCount: number
    absentCount: number
    excusedCount: number
    totalDeduction: number // 유계결석 차감액 총합
    finalAmount: number // 최종 청구액
    attendanceDetails: AttendanceDetail[] // 유계결석 상세 (US-005용)
  }
  
  interface AttendanceDetail {
    date: string
    classId: string
    className: string
    status: string
    deductionAmount: number
  }
  ```

**Service (`src/domain/billing/backend/BillingService.ts`):**
- [ ] `calculateMonthlyBillings(month: string): MonthlyBilling[]`
  - 실시간 계산 (DB 저장 없음)
  - AttendanceService로 출결 데이터 조회
  - ClassService로 반 정보 조회
  - StudentService로 학생 목록 조회
  - 학생별 집계:
    - 소속 반의 월 수강료 합산 (baseAmount)
    - 출석/결석/유계결석 횟수 계산
    - 유계결석 차감액 총합 계산
    - 최종 청구액 = baseAmount - totalDeduction

**API Routes:**
- [ ] `GET /api/billing?month=YYYY-MM` - 특정 월의 전체 학생 청구 내역 실시간 계산 후 반환
  - Query: `month` (required)
  - Response: `MonthlyBilling[]`

### Database Changes
- [ ] **없음** ✅ (실시간 계산, 별도 저장 없음)

### External Dependencies
- [ ] **없음**

## Implementation Order

**최소 구현:**
```
1. Types (MonthlyBilling 인터페이스)
2. BillingService (실시간 계산 로직)
3. API Route (BillingService 호출)
4. Frontend (mock 제거 → API 연동)
```

## Testing Checklist
- [ ] Lint 통과
- [ ] Build 성공
- [ ] 월별 청구 내역 조회 테스트
- [ ] 유계결석 차감액 계산 정확성 테스트
- [ ] 출석/결석/유계결석 횟수 계산 정확성 테스트
- [ ] 최종 청구액 계산 정확성 테스트
- [ ] 여러 반에 소속된 학생의 수강료 합산 테스트

