/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

type LogContext = Record<string, any>;

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private prefix = '[Token Manager]';

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const emoji = Logger.getEmoji(level);
    const style = Logger.getStyle(level);

    console.group(`${emoji} ${this.prefix} [${level.toUpperCase()}] ${timestamp}`);
    console.log(`%c${message}`, style);

    if (context) {
      console.table(context);
    }

    console.groupEnd();
  }

  private static getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      info: '🔵',
      warn: '⚠️',
      error: '❌',
      debug: '🐛',
    };

    return emojis[level];
  }

  private static getStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      info: 'color: #3b82f6; font-weight: bold',
      warn: 'color: #f59e0b; font-weight: bold',
      error: 'color: #ef4444; font-weight: bold',
      debug: 'color: #8b5cf6; font-weight: bold',
    };

    return styles[level];
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  tokenRefreshStart(requestUrl: string) {
    this.info('🔄 Token Refresh Started', { requestUrl });
  }

  tokenRefreshSuccess(requestUrl: string) {
    this.info('✅ Token Refresh Success', { requestUrl });
  }

  tokenRefreshFailed(error: any) {
    this.error('Token Refresh Failed', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }

  queueRequest(url: string, queueSize: number) {
    this.debug('📥 Request Queued', { url, queueSize });
  }

  retryRequest(url: string, retryCount: number) {
    this.info('🔁 Retrying Request', { url, retryCount });
  }

  accessTokenExpired(requestUrl: string) {
    this.warn('⏰ Access Token Expired', { requestUrl });
  }

  refreshTokenExpired() {
    this.error('💀 Refresh Token Expired - Logout Required');
  }
}

export const logger = new Logger();
