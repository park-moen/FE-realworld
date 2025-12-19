import { privateApi, publicApi } from './api.instance';
import { createAuthRequestInterceptor, createAuthResponseInterceptor } from './interceptors/auth.interceptor';
import { createValidationErrorInterceptor } from './interceptors/validation-error.interceptor';
import { tokenManager } from './token-manger';

export async function setupTokenManger(): Promise<void> {
  const { refreshAccessToken } = await import('./api.service');
  tokenManager.initialize(refreshAccessToken);
}

export function setupApiInterceptors(): void {
  // ===== Public API Interceptors =====
  const publicValidationInterceptor = createValidationErrorInterceptor();
  publicApi.interceptors.response.use(publicValidationInterceptor.onFulfilled, publicValidationInterceptor.onRejected);

  // ===== Private API Interceptors =====
  // 1. Request: Bearer 토큰 추가
  const privateAuthRequestInterceptor = createAuthRequestInterceptor();
  privateApi.interceptors.request.use(
    privateAuthRequestInterceptor.onFulfilled,
    privateAuthRequestInterceptor.onRejected,
  );

  // 2. Response: 401 인증 처리
  const privateAuthResponseInterceptor = createAuthResponseInterceptor();
  privateApi.interceptors.response.use(
    privateAuthResponseInterceptor.onFulfilled,
    privateAuthResponseInterceptor.onRejected,
  );

  // 3. Response: Validation 에러 정규화
  const privateValidationInterceptor = createValidationErrorInterceptor();
  privateApi.interceptors.response.use(
    privateValidationInterceptor.onFulfilled,
    privateValidationInterceptor.onRejected,
  );
}

export async function setupApi(): Promise<void> {
  await setupTokenManger();
  setupApiInterceptors();
}
