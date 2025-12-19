/* eslint-disable no-underscore-dangle */
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { store } from '~shared/store';
import { tokenManager, TokenManager } from '../token-manger';

export function createAuthRequestInterceptor() {
  return {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      const { session } = store.getState();

      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }

      return config;
    },
    onRejected: (error: unknown) => Promise.reject(error),
  };
}

export function createAuthResponseInterceptor() {
  return {
    onFulfilled: (response: AxiosResponse) => response,
    onRejected: async (error: any) => {
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
        const { privateApi } = await import('../api.instance');

        // Step 4: 실패한 요청 재시도
        return await privateApi(updatedConfig);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError && TokenManager.shouldLogout(refreshError)) {
          TokenManager.handleLogout(refreshError);
        }

        return Promise.reject(refreshError);
      }
    },
  };
}
