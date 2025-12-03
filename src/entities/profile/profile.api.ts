import { queryOptions } from '@tanstack/react-query';
import { getProfileByUsername } from '~shared/api/api.service';
import { transformProfileDtoToProfile } from './profile.lib';

export const profileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ['profile', username],

    queryFn: async ({ signal }) => {
      const data = await getProfileByUsername(username, { signal });
      const profile = transformProfileDtoToProfile(data);

      return profile;
    },
  });
