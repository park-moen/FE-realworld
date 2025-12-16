# Loader 패턴으로 Request Waterfall 해결

## 📌 개요

React Router v7+의 Data Mode와 Granular Lazy Loading을 활용하여 컴포넌트 로딩과 데이터 페칭이 순차적으로 발생하는 Request Waterfall 문제를 해결하고, 초기 페이지 로딩 성능을 개선했습니다.

## 🚨 기존 방식의 문제점 - Request Waterfall

### Request Waterfall이란?

**Request Waterfall**은 네트워크 요청이 순차적으로 발생하여 **불필요한 대기 시간이 누적되는 현상**입니다.

전통적인 React 애플리케이션에서는 다음과 같은 순서로 동작합니다:

```
1. HTML 로드
   ↓
2. JavaScript 번들 다운로드
   ↓
3. 컴포넌트 렌더링
   ↓
4. 데이터 페칭 시작 (useEffect)
   ↓
5. 데이터 수신 후 UI 렌더링
```

**문제점**: 각 단계가 순차적으로 진행되어 **총 로딩 시간이 각 단계의 합**이 됩니다.

### 시각적 비교

**Before: 순차적 로딩 (Request Waterfall)**

```
Timeline:
|─── HTML ───|─── JS Bundle ───|─── Component ───|─── Data Fetch ───|
0ms          200ms              800ms             1200ms             2000ms
                                                  └─ 800ms 낭비! ─┘
```

사용자는 2000ms를 기다려야 콘텐츠를 볼 수 있습니다.

**After: 병렬 로딩 (Loader 패턴)**

```
Timeline:
|─── HTML ───|─── JS Bundle ───|
                  └─ Component ───|
                  └─ Data Fetch ──|
0ms          200ms              1200ms
                                └─ 병렬 처리로 400ms 단축! ─┘
```

사용자는 1200ms만 기다리면 콘텐츠를 볼 수 있습니다.

### 구체적인 문제 상황

**케이스 1: 전통적인 데이터 페칭**

```typescript
// pages/ArticleListPage.tsx
export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트된 후에야 데이터 페칭 시작
  useEffect(() => {
    fetchArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;
  return <ArticleList articles={articles} />;
}
```

**문제점**:

1. 컴포넌트 코드 다운로드 완료 → 마운트 → useEffect 실행 → 데이터 페칭 시작
2. 데이터 페칭이 가장 마지막 단계에서 시작됨
3. 불필요하게 긴 대기 시간

**케이스 2: Route Splitting에서의 문제**

```typescript
// Before: Promise.all로 묶어도 여전히 순차적
const loginPageRoute = {
  path: '/login',
  lazy: async () => {
    // 1. 라우트 정보 확정 후에야 이 함수가 실행됨
    const [loader, Component] = await Promise.all([
      import('./login-page.loader'), // 2. loader 로드
      import('./login-page.ui'), // 2. Component 로드 (병렬)
    ]);

    return { loader, Component };
    // 3. 반환 후에야 loader 실행 가능
  },
};
```

**타임라인**:

```
Click Link → Route Match → lazy() 실행 → loader + Component 다운로드 → loader 실행
```

**문제점**:

- `lazy()` 함수가 완전히 완료되어야 loader를 실행할 수 있음
- loader와 Component가 병렬로 다운로드되지만, loader는 다운로드 완료 후에도 대기해야 함
- React Router가 "어떤 코드를 언제 실행해야 하는지" 미리 알 수 없음

## ✅ 개선 방식 - Granular Lazy Loading

### React Router v7의 해결책

React Router v7.5+에서 도입된 **Granular Lazy Loading** API는 각 라우트 속성을 **개별적으로 lazy load**할 수 있게 합니다.

### 핵심 아이디어

```typescript
// 기존: 하나의 함수로 모든 것을 반환
lazy: () => import('./route')

// 개선: 각 속성을 개별 함수로 정의
lazy: {
  loader: () => import('./route').then(m => m.loader),
  Component: () => import('./route').then(m => m.Component),
}
```

**장점**:

1. React Router가 각 속성을 **언제 로드해야 하는지 미리 알 수 있음**
2. 필요한 시점에 **즉시 해당 코드만 로드**
3. loader와 Component를 **진정한 의미의 병렬 처리**

### 실제 적용 코드

**Before: 기존 방식**

```typescript
import { RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/router';

export const loginPageRoute: RouteObject = {
  path: pathKeys.login,
  lazy: async () => {
    // 모든 코드를 한 번에 로드
    const [loader, Component] = await Promise.all([
      import('./login-page.loader').then((module) => module.default),
      import('./login-page.ui').then((module) => module.default),
    ]);

    return { loader, Component };
  },
};
```

**타임라인**:

```
Click /login
  ↓
1. lazy() 함수 실행
  ↓
2. loader + Component 병렬 다운로드 (Promise.all)
  ↓
3. 모두 다운로드 완료 대기
  ↓
4. lazy() 함수 반환
  ↓
5. loader 실행
  ↓
6. Component 렌더링
```

**After: Granular Lazy Loading**

```typescript
import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const loginPageRoute: RouteObject = {
  path: pathKey.login,

  lazy: {
    // 각 속성을 개별 함수로 정의
    loader: () => import('./login-page.loader').then((module) => module.default),
    Component: () => import('./login-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
```

**타임라인**:

```
Click /login
  ↓
1. React Router가 lazy.loader와 lazy.Component를 병렬 실행
  ├─ loader 다운로드 → 즉시 실행
  └─ Component 다운로드 → loader 완료 후 렌더링
```

## 📊 개선 효과

### 1. 진정한 병렬 처리

**Before**: Promise.all은 다운로드만 병렬화

```typescript
// loader와 Component 다운로드가 병렬
// 하지만 둘 다 완료될 때까지 loader 실행 대기
const [loader, Component] = await Promise.all([...]);
```

**After**: React Router가 다운로드와 실행을 모두 최적화

```typescript
// loader 다운로드 완료 → 즉시 실행 (Component 대기 불필요)
lazy: {
  loader: () => import('./loader'),
  Component: () => import('./component'),
}
```

### 2. 코드 분리 최적화

Granular Lazy Loading을 사용하면 loader와 Component를 **완전히 별도 파일**로 분리할 수 있습니다:

```
pages/
  login/
    login-page.route.ts    # 라우트 정의
    login-page.loader.ts   # 데이터 로딩 로직만
    login-page.ui.tsx      # UI 컴포넌트만
```

**장점**:

- 필요한 코드만 다운로드 (예: loader만 필요한 경우)
- 번들 크기 최적화
- 캐싱 효율 증가

### 3. 초기 로딩 시간 단축

**측정 예시** (가상 시나리오):

```
Before:
- lazy() 다운로드: 100ms
- loader + Component 다운로드: 300ms (병렬)
- loader 실행: 200ms
- 총: 100ms + 300ms + 200ms = 600ms

After:
- loader 다운로드: 150ms
- Component 다운로드: 200ms (병렬)
- loader 실행: 200ms (다운로드 완료 즉시)
- 총: max(150ms, 200ms) + 200ms = 400ms

개선: 200ms (33% 단축)
```

실제 개선율은 네트워크 속도, 파일 크기, loader 실행 시간에 따라 다릅니다.

### 4. 사용자 경험 개선

- **체감 속도 향상**: 콘텐츠가 더 빠르게 표시됨
- **부드러운 전환**: 로딩 상태 노출 시간 감소

## 📚 참고 자료

- [Remix Blog - Faster Lazy Loading](https://remix.run/blog/faster-lazy-loading)
- [React Router v7.5 Changelog](https://reactrouter.com/changelog#v750)
