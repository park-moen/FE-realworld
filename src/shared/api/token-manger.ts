import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { pathKey } from '~shared/router';
import { store } from '~shared/store';
import { resetSession, setSession } from '~entities/session/session.model';
import type { RefreshResponseDto } from './api.schemas';
import { AuthErrorCode, parseAuthError, type AuthErrorResponse } from './errors/auth-error.types';

interface PendingRequest {
  config: InternalAxiosRequestConfig;
  resolve: (config: InternalAxiosRequestConfig) => void;
  reject: (error: unknown) => void;
}

type RefreshTokenFunction = () => Promise<RefreshResponseDto>;
type AxiosAuthError = AxiosError<{ error: AuthErrorResponse }>;
type RefreshState = { status: 'idle' } | { status: 'refreshing'; promise: Promise<RefreshResponseDto> };

class TokenManager {
  private refreshState: RefreshState = { status: 'idle' };

  private pendingRequests: PendingRequest[] = [];

  private refreshTokenFn: RefreshTokenFunction | null = null;

  initialize(refreshTokenFn: RefreshTokenFunction): void {
    this.refreshTokenFn = refreshTokenFn;
  }

  async handle401Error(
    error: AxiosAuthError,
    originalConfig: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    if (TokenManager.shouldLogout(error)) {
      TokenManager.handleLogout(error);
      throw error;
    }

    if (this.refreshState.status === 'refreshing') {
      return this.addToQueue(originalConfig);
    }

    try {
      const refreshResponse = await this.refreshToken();
      const accessToken = refreshResponse.user.token;

      originalConfig.headers.Authorization = `Bearer ${accessToken}`;

      this.retryAllPendingRequests(accessToken);

      return originalConfig;
    } catch (refreshError) {
      this.rejectAllPendingRequests(refreshError);
      throw refreshError;
    }
  }

  private async refreshToken(): Promise<RefreshResponseDto> {
    if (!this.refreshTokenFn) {
      throw new Error('TokenManger not initialized. Call initialize() first');
    }

    if (this.refreshState.status === 'refreshing') {
      return this.refreshState.promise;
    }

    const refreshPromise = this.refreshTokenFn()
      .then((response) => {
        const accessToken = response.user.token;

        const currentSession = store.getState().session;
        if (currentSession) {
          store.dispatch(setSession({ ...currentSession, token: accessToken }));
        }

        return response;
      })
      .finally(() => {
        this.refreshState = { status: 'idle' };
      });

    this.refreshState = { status: 'refreshing', promise: refreshPromise };

    return refreshPromise;
  }

  private addToQueue(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    return new Promise((resolve, reject) => {
      this.pendingRequests.push({ config, resolve, reject });
    });
  }

  private retryAllPendingRequests(newAccessToken: string): void {
    this.pendingRequests.forEach(({ config, resolve }, index) => {
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      resolve(config);
    });

    this.pendingRequests = [];
  }

  private rejectAllPendingRequests(error: unknown): void {
    this.pendingRequests.forEach(({ reject }) => {
      reject(error);
    });

    this.pendingRequests = [];
  }

  static shouldLogout(error: AxiosAuthError): boolean {
    const authError = parseAuthError(error);

    if (!authError) {
      return false;
    }

    return (
      authError.code === AuthErrorCode.REFRESH_TOKEN_REVOKED ||
      authError.code === AuthErrorCode.TOKEN_INVALID ||
      (authError.code === AuthErrorCode.TOKEN_EXPIRED && authError.details?.tokenType === 'refresh')
    );
  }

  static handleLogout(error: AxiosAuthError): void {
    const authError = parseAuthError(error);

    store.dispatch(resetSession());

    const currentPath = window.location.pathname;
    if (currentPath === pathKey.login) {
      return;
    }

    const redirectPath = `${pathKey.login}?redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = redirectPath;

    if (authError?.code === AuthErrorCode.REFRESH_TOKEN_REVOKED) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  }
}

export const tokenManager = new TokenManager();
export { TokenManager };
