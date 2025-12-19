import type { AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';
import { normalizeValidationErrors } from '../api.lib';
import { ApiErrorDataDtoSchema } from '../api.schemas';

export function createValidationErrorInterceptor() {
  return {
    onFulfilled: (response: AxiosResponse) => response,
    onRejected: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      if (!error.response) {
        return Promise.reject(error);
      }

      const validation = ApiErrorDataDtoSchema.safeParse(error.response?.data);

      if (!validation.success) {
        return Promise.reject(error);
      }

      const normalizedErrorResponse = {
        ...error.response,
        data: normalizeValidationErrors(validation.data),
      } as AxiosResponse;

      return Promise.reject(
        new AxiosError(error.message, error.code, error.config, error.request, normalizedErrorResponse),
      );
    },
  };
}
