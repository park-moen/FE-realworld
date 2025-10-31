import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { z } from 'zod';
import { registerUser } from '~shared/api/api.service';
import { type RegisterUser } from './register.schema';

export const UserSchema = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});

type User = z.infer<typeof UserSchema>;

export function useRegisterMutation(
  options: Pick<
    UseMutationOptions<User, AxiosError, RegisterUser>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'register-user', ...mutationKey],

    mutationFn: async (registerUserData: RegisterUser) => {
      const registerUserDto = { user: registerUserData };
      const { user } = await registerUser(registerUserDto);

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
