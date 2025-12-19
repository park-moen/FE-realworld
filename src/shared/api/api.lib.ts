import type { ApiErrorData, ApiErrorDataDto } from './api.schemas';

export function normalizeValidationErrors({ error }: ApiErrorDataDto): ApiErrorData {
  return {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
    path: error.path,
    correlationId: error.correlationId,
    details: error.details ? normalizeDetails(error.details) : undefined,
  };
}

function normalizeDetails(details: unknown): {
  raw: unknown;
  messages: string[];
} {
  const messages: string[] = [];

  if (Array.isArray(details)) {
    details.forEach((item) => {
      if (typeof item === 'string') {
        messages.push(item);
      } else if (typeof item === 'object' && item !== null) {
        messages.push(JSON.stringify(item));
      }
    });
  } else if (details && typeof details === 'object' && !Array.isArray(details)) {
    Object.entries(details).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        value.forEach((message) => {
          if (typeof message === 'string') {
            messages.push(`${field} ${message}`);
          }
        });
      } else if (typeof value === 'string') {
        messages.push(`${field} ${value}`);
      } else if (typeof value === 'number') {
        messages.push(`${field} ${value}`);
      } else {
        messages.push(`${field} ${JSON.stringify(value)}`);
      }
    });
  } else if (typeof details === 'string') {
    messages.push(details);
  } else {
    messages.push(String(details));
  }

  return {
    raw: details,
    messages: messages.length > 0 ? messages : ['An error occurred'],
  };
}
