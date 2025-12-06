// ? ✅ 임시 에러 추출 함수 -> 다음 작업에서 도메인별 에러 정규화 작업 진행 예정
export function getErrorMessage(error: unknown): string[] {
  if (!error) return [];

  const errorData = (error as any)?.response?.data?.error;

  // 백엔드 에러 구조: { error: { details: [...], message: "..." } }
  if (errorData?.details && Array.isArray(errorData.details)) {
    return errorData.details.map((data: { message: string }) => data.message);
  }

  if (errorData?.message) {
    return [errorData.message];
  }

  return [(error as any)?.message || 'An error occurred'];
}
