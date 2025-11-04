# 버그 리포트 - 반 관리/학생 페이지 TypeError

- **발생 일시**: 2025-11-04
- **기능**: 학생 관리 페이지
- **오류 메시지**: `Cannot read properties of undefined (reading 'length')`
- **위치**: `src/app/students/page.tsx:274`
- **재현 단계**:
  1. 학생 관리 페이지(`/students`) 접속
  2. 학생 목록 테이블 렌더링 시 오류 발생
- **현재 원인 분석**: `student.classIds`가 undefined인 학생 데이터가 존재
- **진행 상황**: 수정 완료
