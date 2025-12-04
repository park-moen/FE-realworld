import { queryOptions } from '@tanstack/react-query';
import { getAllTags } from '~shared/api/api.service';
import { transformTagsDtoToTags } from './tag.lib';

export const tagsQueryOptions = queryOptions({
  queryKey: ['tags'],

  queryFn: async () => {
    const data = await getAllTags();
    const tags = transformTagsDtoToTags(data);

    return tags;
  },
});
