import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { loginUser } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';
import type { User } from '~entities/session/session.type';
import { transformLoginUserToLoginUserDto } from './login.lib';
import type { LoginUser } from './login.schema';

export function useLoginMutation(
  options: Pick<
    UseMutationOptions<User, AxiosError, LoginUser>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'login-user', ...mutationKey],

    mutationFn: async (loginUserData: LoginUser) => {
      const loginUserDto = transformLoginUserToLoginUserDto(loginUserData);
      const data = await loginUser(loginUserDto);
      const user = transformUserDtoToUser(data);

      return user;
    },

    onMutate,

    onSuccess: async (data, variables, onMutateResult, context) => {
      store.dispatch(setSession(data));
      queryClient.setQueryData(sessionQueryOptions.queryKey, data);
      await onSuccess?.(data, variables, onMutateResult, context);
    },

    onError,

    onSettled,
  });
}
