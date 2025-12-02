/* eslint-disable no-underscore-dangle */
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { logger } from '~shared/lib/utils';
import { store } from '~shared/store';
import { api } from './api.instance';
import { tokenManager, TokenManager } from './token-manger';

export async function setupTokenManger(): Promise<void> {
  const { refreshAccessToken } = await import('./api.service');
  tokenManager.initialize(refreshAccessToken);
}

export function setupApiInterceptors(): void {
  api.interceptors.request.use(
    (config) => {
      const { session } = store.getState();

      logger.debug('📤 Request Interceptor', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: !!session?.token,
      });

      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
        logger.debug('🔑 Token added to request');
      } else {
        logger.warn('⚠️ No token available');
      }

      return config;
    },
    (error) => {
      logger.error('❌ Request Interceptor Error', { error });
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig: InternalAxiosRequestConfig = error.config;

      // 401이 아니면 reject
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalConfig?.url?.includes('/users/refresh')) {
        logger.error('💥 Refresh API failed, cannot retry');

        if (TokenManager.shouldLogout(error)) {
          TokenManager.handleLogout(error);
        }

        return Promise.reject(error);
      }

      // ✅ 이미 재시도한 요청이면 reject
      if (originalConfig?._retry) {
        logger.warn('⚠️ Request already retried, stopping');
        return Promise.reject(error);
      }

      try {
        // ✅ 재시도 플래그 설정
        originalConfig._retry = true;

        logger.info('🔄 First retry, refreshing token');

        const updatedConfig = await tokenManager.handle401Error(error, originalConfig);

        logger.info('🔄 Retrying original request', {
          url: updatedConfig.url,
        });

        // Step 4: 실패한 요청 재시도
        return await api(updatedConfig);
      } catch (refreshError) {
        logger.error('💥 Token refresh failed', { refreshError });

        if (refreshError instanceof AxiosError && TokenManager.shouldLogout(refreshError)) {
          TokenManager.handleLogout(refreshError);
        }

        return Promise.reject(refreshError);
      }
    },
  );

  logger.info('✅ Request Interceptor initialized');
  logger.info('✅ Response Interceptor initialized');
}

export async function setupApi(): Promise<void> {
  await setupTokenManger();
  setupApiInterceptors();
}
