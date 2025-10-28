# 📋 Testing Strategy

> Kent C. Dodds의 "Write tests. Not too many. Mostly integration." 철학을 따릅니다.

---

## 🎯 테스트 철학

### 테스트 피라미드

```
        E2E (30%)
       ↗     ↖
  Integration (50%)  ← 가장 중요!
    ↗           ↖
 Unit (20%)    Static
```

**핵심**: Integration Test 중심으로 사용자 경험을 검증합니다.

---

### 📊 테스트 전략 개요

| **테스트 레벨**      | **목적**               | **Mock 사용**    | **도구**                    |
| -------------------- | ---------------------- | ---------------- | --------------------------- |
| **Unit Test**        | 비즈니스 로직 검증     | ✅ Yes           | Vitest                      |
| **Integration Test** | 컴포넌트 상호작용 검증 | ✅ Yes (API만)   | React Testing Library + MSW |
| **E2E Test**         | 사용자 흐름 검증       | ❌ No (실제 API) | Cypress                     |

---

## 🎯 Kent C. Dodds TDD 워크플로우

### 1. 비즈니스 로직 (Unit Test)

**대상**: Utils, Helpers, 순수 함수

**워크플로우**:

```
1. Red: 테스트 작성
2. Green: 최소 구현
3. Refactor: 코드 개선
```

**예시**: **`validateEmail`**, **`calculateDiscount`**, **`formatDate`**

---

### 2. 명확한 UI (Integration Test)

**판단 기준**: [**명확한 UI 체크리스트**](https://www.perplexity.ai/search/fe-chore-gwanryeon-jilmun-bang-ZEwki.kOQ6.WxF4J4ktgzw#ui-classification) 참고

**워크플로우**:

```
1. Red: Integration Test 작성 (사용자 행동 중심)
2. Green: Component 구현
3. Storybook: 문서화 (선택)
4. Refactor: 코드 개선
```

---

### 3. 탐색적 UI (Component-First)

**판단 기준**: [**탐색적 UI 체크리스트**](https://www.perplexity.ai/search/fe-chore-gwanryeon-jilmun-bang-ZEwki.kOQ6.WxF4J4ktgzw#ui-classification) 참고

**워크플로우**:

```
1. Storybook: 여러 버전 시각적 탐색
2. Component: 구현 (디자이너/PM 피드백)
3. Integration Test: 동작 검증 (나중)
4. Refactor: 코드 개선
```

---

### 4. E2E Test (Feature 완성 후)

**워크플로우**:

```
1. Feature 완성 확인
2. E2E Test 작성 (실제 API)
3. 로컬 테스트 (Railway 개발 서버)
4. Push → CI/CD 실행
```

---

## 📋 UI 분류 기준 {#ui-classification}

#### 명확한 UI (TDD 적용)

##### 체크리스트 (3개 이상 ✅ → TDD)

- [ ] Figma/Sketch 디자인 존재
- [ ] 요구사항이 1문장으로 설명 가능
- [ ] 에러 케이스를 미리 알 수 있음
- [ ] 비슷한 UI를 본 적 있음
- [ ] 변경될 가능성이 낮음

#### 특징

| **기준**    | **상태**  |
| ----------- | --------- |
| 디자인      | ✅ 확정됨 |
| 요구사항    | ✅ 구체적 |
| 레이아웃    | ✅ 명확함 |
| 동작        | ✅ 단순함 |
| 변경 가능성 | ✅ 낮음   |

### 예시

- 로그인/회원가입 폼
- 버튼, 입력 필드
- 기본 모달
- 검색 컴포넌트 (자동완성)

---

### 탐색적 UI (Component-First)

### 체크리스트 (3개 이상 ✅ → Component-First)

- [ ] 디자인이 없거나 대략적
- [ ] "보기 좋게" 같은 모호한 요구사항
- [ ] 여러 버전을 시도해야 함
- [ ] 처음 보는 인터랙션
- [ ] 디자이너/PM 피드백 필요

### 특징

| **기준**    | **상태**  |
| ----------- | --------- |
| 디자인      | ❌ 미확정 |
| 요구사항    | ❌ 모호함 |
| 레이아웃    | ❌ 불명확 |
| 동작        | ❌ 복잡함 |
| 변경 가능성 | ❌ 높음   |

### 예시

- 대시보드
- 복잡한 차트/데이터 시각화
- 새로운 기능
- 실험적 UI

---

## 📚 Storybook 적용 기준

### 전략 1: 선택적 사용 (효율 우선)

```
Storybook 작성 조건 (하나라도 Yes):
- 재사용 가능한 공통 컴포넌트
- 디자이너/PM과 협업 필요
- 여러 상태를 시각적으로 확인 필요
- 포트폴리오 용도
```

### 적용 대상

- ✅ 공통 컴포넌트 (Button, Input, Modal)
- ✅ 복잡한 상태를 가진 컴포넌트
- ✅ 탐색적 UI (필수!)
- ❌ 간단한 Presentational 컴포넌트

---

### 전략 2: 항상 작성 (문서화 우선) ⭐ 추천

```
모든 컴포넌트에 Storybook 작성:
- 명확한 문서화
- 팀 협업 용이
- Visual Regression Test 가능
- 포트폴리오 완성도 향상
```

### 장점

- ✅ 일관된 문서화
- ✅ 컴포넌트 재사용 확인 용이
- ✅ 디자인 시스템 구축 기반
- ✅ 포트폴리오 품질 향상

### 단점

- ❌ 초기 작업 시간 증가
- ❌ 유지보수 비용

---

## 🚀 TBD 개발 워크플로우

### Feature 개발 시나리오

### Day 1: 비즈니스 로직

```
1. Unit Test 작성 (TDD Red)
2. Utils 함수 구현 (TDD Green)
3. Refactor
4. Commit (로컬)
```

### Day 2-3: UI 컴포넌트

**명확한 UI인 경우**:

```
1. Integration Test 작성 (TDD Red)
2. Component 구현 (TDD Green)
3. Storybook 작성 (문서화)
4. Refactor
5. Commit (로컬)
```

**탐색적 UI인 경우**:

```
1. Storybook으로 여러 버전 탐색
2. Component 구현
3. Integration Test 작성 (나중)
4. Refactor
5. Commit (로컬)
```

### Day 4: E2E Test

```
1. E2E Test 작성
2. 로컬 테스트 (Railway 개발 서버)
3. Commit (로컬)
4. Feature 완성 확인
5. Push → CI/CD 실행
```

---

## 📁 테스트 파일 구조

```
src/
├── utils/
│   ├── validation.ts
│   └── validation.test.ts          # Unit Test
│
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx      # Integration Test
│   │   └── LoginForm.stories.tsx   # Storybook
│   │
│   └── Dashboard/
│       ├── Dashboard.tsx
│       ├── Dashboard.test.tsx
│       └── Dashboard.stories.tsx
│
└── cypress/
    └── e2e/
        └── auth.cy.ts               # E2E Test
```

---

## 🎯 테스트 작성 규칙

### Unit Test

- ✅ 순수 함수만 테스트
- ✅ 비즈니스 로직 검증
- ✅ Mock 사용 (외부 의존성)
- ❌ UI 테스트 금지

### Integration Test

- ✅ 사용자 행동 중심
- ✅ React Testing Library 사용
- ✅ MSW로 API Mock
- ❌ 구현 세부사항 테스트 금지

### E2E Test

- ✅ 실제 API 사용 (Railway)
- ✅ 핵심 사용자 흐름만
- ✅ 태그 활용 (@smoke, @critical)
- ❌ Mock 사용 금지 (외부 API 제외)

---

## 📊 Mock 사용 지침

| **테스트 레벨** | **자체 API** | **외부 API** | **이유**     |
| --------------- | ------------ | ------------ | ------------ |
| **Unit**        | Mock ✅      | Mock ✅      | 격리         |
| **Integration** | Mock ✅      | Mock ✅      | 통제         |
| **E2E**         | Real ✅      | Mock ✅      | 배포 전 검증 |

### 외부 API Mock 대상

- 결제 (Stripe, PayPal)
- OAuth (Google, Facebook)
- 외부 서비스 (날씨, 지도)

---

## 🔄 CI/CD 테스트 전략

### PR 생성 시

```
1. ESLint + Prettier
2. Unit Test
3. Integration Test
4. E2E Test (Railway 개발 서버)
```

### Main 병합 시

```
1. 전체 테스트 실행
2. Build 검증
3. Vercel 프리뷰 배포
```

---

## 📈 테스트 커버리지 목표

| **레벨**    | **목표**       |
| ----------- | -------------- |
| Unit        | 80%            |
| Integration | 70%            |
| E2E         | 핵심 흐름 100% |

---

## 🛠️ 테스트 명령어

```bash
*# Unit Test*
npm run test

*# Integration Test*
npm run test:integration

*# E2E Test (로컬)*
npm run cy:open

*# E2E Test (CI)*
npm run cy:run

*# 전체 테스트*
npm run test:all

*# Coverage*
npm run test:coverage

*# Storybook*
npm run storybook
```

---

## 📚 참고 자료

- [**Kent C. Dodds - Testing Library**](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/)
- [**Cypress Best Practices**](https://docs.cypress.io/guides/references/best-practices)
- [**Storybook Docs**](https://storybook.js.org/docs/react/get-started/introduction)
