# Feature: 월별 청구서 발행
> 관리자가 최종 확인된 청구 금액으로 청구서를 발행하고 이력을 관리할 수 있습니다.

## Source
tasks.yaml - [US-006: 월별 청구서 발행]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/billing/page.tsx` - 청구서 발행 기능 구현

**Changes:**
- "청구서 발행" 버튼 동작 구현
- 청구서 텍스트 생성 및 미리보기 (이미 구현됨)
- 복사하기 버튼 (이미 구현됨)
- 발행 상태 표시 (발행완료/미발행)

### Backend

**Database Changes:**
- [ ] `invoices` 테이블 추가
  - `id` TEXT PRIMARY KEY (UUID)
  - `student_id` TEXT NOT NULL
  - `month` TEXT NOT NULL (YYYY-MM)
  - `base_amount` INTEGER NOT NULL
  - `total_deduction` INTEGER NOT NULL
  - `final_amount` INTEGER NOT NULL
  - `invoice_text` TEXT NOT NULL
  - `issued_at` DATETIME DEFAULT CURRENT_TIMESTAMP
  - UNIQUE (student_id, month)

**Types (`src/domain/billing/types.ts`):**
- [ ] `Invoice` interface 추가

**Repository (`src/domain/billing/backend/InvoiceRepo.interface.ts`):**
- [ ] `createInvoice(data): Invoice`
- [ ] `findInvoiceByStudentAndMonth(studentId, month): Invoice | null`
- [ ] `findInvoicesByMonth(month): Invoice[]`

**Repository Implementation (`src/domain/billing/backend/SqliteInvoiceRepo.ts`):**
- [ ] 위 인터페이스 구현

**Service (`src/domain/billing/backend/BillingService.ts`):**
- [ ] `issueInvoice(billing: MonthlyBilling): Invoice` - 청구서 발행
- [ ] `getInvoices(month: string): Invoice[]` - 발행된 청구서 목록 조회

**API Routes:**
- [ ] `POST /api/billing/invoice` - 청구서 발행
  - Body: `{ studentId, month }`
  - Response: `Invoice`
- [ ] `GET /api/billing/invoice?month=YYYY-MM` - 발행된 청구서 목록 조회
  - Query: `month`
  - Response: `Invoice[]`

### Database Changes
- [ ] `invoices` 테이블 추가

### External Dependencies
- [ ] **없음**

## Implementation Order

**정교한 구현:**
```
1. Types (Invoice 인터페이스)
2. Repository Interface
3. Repository Implementation
4. Service (issueInvoice, getInvoices)
5. DB Table 생성
6. API Routes
7. Frontend (청구서 발행 기능 연동)
```

## Testing Checklist
- [ ] Lint 통과
- [ ] 청구서 발행 테스트
- [ ] 중복 발행 방지 테스트
- [ ] 발행 이력 조회 테스트
- [ ] 청구서 텍스트 생성 정확성 테스트

