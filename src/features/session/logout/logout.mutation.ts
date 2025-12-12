import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { store } from '~shared/store';
import { resetSession } from '~entities/session/session.model';

export function useLogoutMutation(options: Pick<UseMutationOptions, 'mutationKey' | 'onSuccess'> = {}) {
  const { mutationKey = [], onSuccess } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['session', 'logout', ...mutationKey],

    async mutationFn() {
      queryClient.removeQueries();
      store.dispatch(resetSession());
    },

    onSuccess(data, variables, onMutateResult, context) {
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
