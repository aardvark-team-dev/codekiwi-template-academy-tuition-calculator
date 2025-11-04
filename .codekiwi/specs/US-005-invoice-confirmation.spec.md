# Feature: 청구서 발행 전 확인
> 관리자가 청구서 발행 전 유계결석 내역과 차감 금액을 최종 확인할 수 있습니다.

## Source
tasks.yaml - [US-005: 청구서 발행 전 확인]

## Implementation Scope

### Frontend
**Pages/Components:**
- [ ] `src/app/billing/page.tsx` - 상세보기 Dialog 이미 구현되어 있음

**Changes:**
- 이미 구현되어 있는 기능 검증
- "상세보기" 버튼으로 유계결석 내역 확인 가능
- 차감 전 정액 수강료와 차감 후 최종 청구액 비교 표시
- UI/UX 개선 (필요시)

### Backend
- [ ] **없음** (US-004에서 이미 구현됨)

### Database Changes
- [ ] **없음**

### External Dependencies
- [ ] **없음**

## Implementation Order

**최소 구현:**
```
1. Frontend UI 검증 및 개선
   - 상세보기 Dialog에 이미 구현된 기능 확인
   - AC 요구사항과 비교
```

## Acceptance Criteria Check
- [ ] 학생별 유계결석 날짜와 차감액이 목록으로 표시 ✅ (이미 구현됨)
- [ ] 차감 전 정액 수강료와 차감 후 최종 청구액 비교 표시 ✅ (이미 구현됨)
- [ ] 확인 후 청구서 발행 버튼 클릭 가능 (US-006에서 구현 예정)
- [ ] 수정이 필요한 경우 출결 입력 화면으로 이동 가능 (Link 추가 필요)

## Testing Checklist
- [ ] Lint 통과
- [ ] 상세보기 Dialog 동작 확인
- [ ] 유계결석 상세 내역 표시 확인
- [ ] 정액 수강료 vs 최종 청구액 비교 표시 확인

