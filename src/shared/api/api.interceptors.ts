/* eslint-disable no-underscore-dangle */
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '~shared/store';
import { privateApi, publicApi } from './api.instance';
import { createValidationErrorInterceptor } from './interceptors/validation-error.interceptor';
import { tokenManager, TokenManager } from './token-manger';

export async function setupTokenManger(): Promise<void> {
  const { refreshAccessToken } = await import('./api.service');
  tokenManager.initialize(refreshAccessToken);
}

export function setupApiInterceptors(): void {
  privateApi.interceptors.request.use(
    (config) => {
      const { session } = store.getState();

      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig: InternalAxiosRequestConfig = error.config;

      // 401이 아니면 reject
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalConfig.url?.includes('users/login') || originalConfig.url?.includes('users/register')) {
        return Promise.reject(error);
      }

      if (originalConfig?.url?.includes('/users/refresh')) {
        if (TokenManager.shouldLogout(error)) {
          TokenManager.handleLogout(error);
        }

        return Promise.reject(error);
      }

      // ✅ 이미 재시도한 요청이면 reject
      if (originalConfig?._retry) {
        return Promise.reject(error);
      }

      try {
        // ✅ 재시도 플래그 설정
        originalConfig._retry = true;

        const updatedConfig = await tokenManager.handle401Error(error, originalConfig);

        // Step 4: 실패한 요청 재시도
        return await privateApi(updatedConfig);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError && TokenManager.shouldLogout(refreshError)) {
          TokenManager.handleLogout(refreshError);
        }

        return Promise.reject(refreshError);
      }
    },
  );

  const publicValidationInterceptor = createValidationErrorInterceptor();
  publicApi.interceptors.response.use(publicValidationInterceptor.onFulfilled, publicValidationInterceptor.onRejected);

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
