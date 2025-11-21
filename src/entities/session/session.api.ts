import { queryOptions } from '@tanstack/react-query';
import { getUser } from '~shared/api/api.service';
import { transformUserDtoToUser } from './session.lib';

export const sessionQueryOptions = queryOptions({
  queryKey: ['session', 'current-user'] as const,

  queryFn: async ({ signal }) => {
    const data = await getUser({ signal });
    const user = transformUserDtoToUser(data);

    return user;
  },
});
