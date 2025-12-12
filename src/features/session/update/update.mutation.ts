import { useMutation, useQueryClient, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { updateUser } from '~shared/api/api.service';
import { store } from '~shared/store';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { sessionQueryOptions } from '~entities/session/session.api';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';
import type { User } from '~entities/session/session.type';
import { transformUpdateUserToProfile, transformUpdateUserToUpdateUserDto } from './update.lib';
import type { UpdateUser } from './update.type';

export function useUpdateUserMutation(
  options: Pick<UseMutationOptions<User, DefaultError, UpdateUser>, 'mutationKey' | 'onSuccess'> = {},
) {
  const { mutationKey = [], onSuccess } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['session', 'update', ...mutationKey],

    async mutationFn(updateUserData: UpdateUser) {
      const updateUserDto = transformUpdateUserToUpdateUserDto(updateUserData);
      const data = await updateUser(updateUserDto);
      const user = transformUserDtoToUser(data);

      return user;
    },

    async onSuccess(data, variables, onMutateResult, context) {
      const sessionQueryKey = sessionQueryOptions.queryKey;
      const profileQueryKey = profileQueryOptions(data.username).queryKey;

      const userToProfile = transformUpdateUserToProfile(data);

      queryClient.setQueryData(sessionQueryKey, data);
      queryClient.setQueryData(profileQueryKey, userToProfile);
      store.dispatch(setSession(data));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sessionQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        onSuccess?.(data, variables, onMutateResult, context),
      ]);
    },
  });
}
