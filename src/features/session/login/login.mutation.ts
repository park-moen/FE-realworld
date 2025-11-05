import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import z from 'zod';
import { loginUser } from '~shared/api/api.service';
import type { LoginUser } from './login.schema';

export const UserSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});

type User = z.infer<typeof UserSchema>;

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
      const loginUserDto = { user: loginUserData };
      const { user } = await loginUser(loginUserDto);

      return user;
    },

    onMutate,

    onSuccess: async (data, variables, onMutateResult, context) => {
      localStorage.setItem('token', JSON.stringify(data.token));
      await onSuccess?.(data, variables, onMutateResult, context);
    },

    onError,

    onSettled,
  });
}
