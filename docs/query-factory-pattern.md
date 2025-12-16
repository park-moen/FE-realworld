# Query Factory 패턴

## 문제 상황

기존에는 컴포넌트마다 queryKey를 직접 생성하다 보니:

- 동일한 쿼리에 대해 다른 queryKey 사용 (캐시 비효율)
- 타입 추론 어려움
- queryKey 중복 생성으로 메모리 낭비

```typescript
// Before: 컴포넌트에서 직접 작성
const { data } = useQuery({
  queryKey: ['article', slug], // 매번 새 배열 생성
  queryFn: () => fetchArticle(slug),
});
```

## 해결 방법

`queryOptions` 기반 Query Factory로 도메인별 쿼리 중앙 관리

```typescript
// entities/session/session.api.ts
export const sessionQueryOptions = queryOptions({
  queryKey: ['session', 'current-user'] as const,

  queryFn: async ({ signal }) => {
    const data = await getUser({ signal });
    const user = transformUserDtoToUser(data);

    return user;
  },
});
```

```typescript
// 컴포넌트에서 사용
const { data } = useQuery(sessionQueryOptions);
```

## 효과

1. **타입 안전성**: queryKey와 queryFn의 타입이 자동 추론
2. **메모리 효율**: queryKey 배열을 재사용하여 불필요한 객체 생성 방지
3. **유지보수성**: 쿼리 관련 로직이 도메인별로 응집
4. **캐시 관리 용이**: 계층적 queryKey로 invalidation 간편

## 적용 사례

- Article 도메인: [Link](https://github.com/park-moen/FE-realworld/blob/main/src/entities/article/article.api.ts)
- Comment 도메인: [Link](https://github.com/park-moen/FE-realworld/blob/main/src/entities/comment/comment.api.ts)
- Profile 도메인: [Link](https://github.com/park-moen/FE-realworld/blob/main/src/entities/profile/profile.api.ts)
- User 도메인: [Link](https://github.com/park-moen/FE-realworld/blob/main/src/entities/session/session.api.ts)
- Tag 도메인: [Link](https://github.com/park-moen/FE-realworld/blob/main/src/entities/tag/tag.api.ts)
