export enum AuthErrorCode {
  TOKEN_EXPIRED = 'AUTH.TOKEN_EXPIRED',
  TOKEN_INVALID = 'AUTH.TOKEN_INVALID',
  TOKEN_NOT_FOUND = 'AUTH.TOKEN_NOT_FOUND',
  REFRESH_TOKEN_REVOKED = 'AUTH.REFRESH_TOKEN_REVOKED',

  // Credentials
  INVALID_CREDENTIALS = 'AUTH.INVALID_CREDENTIALS',
}

export interface AuthErrorResponse {
  error: {
    code: AuthErrorCode;
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    correlationId: string;
    details?: {
      tokenType?: 'access' | 'refresh';
      expiredAt?: string;
      jti?: string;
    };
    stack?: string;
  };
}

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    public readonly statusCode: number,
    public readonly timestamp: string,
    public readonly path: string,
    public readonly correlationId: string,
    public readonly details?: {
      tokenType?: 'access' | 'refresh';
      expiredAt?: string;
      jti?: string;
    },
  ) {
    super(`Auth Error ${code}`);
    this.name = 'AuthError';
  }

  static isTokenExpired(error: unknown): boolean {
    return error instanceof AuthError && error.code === AuthErrorCode.TOKEN_EXPIRED;
  }

  static isTokenInvalid(error: unknown): boolean {
    return error instanceof AuthError && error.code === AuthErrorCode.TOKEN_INVALID;
  }

  static isRefreshTokenRevoked(error: unknown): boolean {
    return error instanceof AuthError && error.code === AuthErrorCode.REFRESH_TOKEN_REVOKED;
  }
}

export function parseAuthError(error: any): AuthError | null {
  const errorData = error.response?.data?.error;

  if (!errorData?.code || !Object.values(AuthErrorCode).includes(errorData.code)) {
    return null;
  }

  return new AuthError(
    errorData.code,
    errorData.statusCode,
    errorData.timestamp,
    errorData.path,
    errorData.correlationId,
    errorData.details,
  );
}
