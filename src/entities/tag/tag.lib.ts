import type { TagsDto } from '~shared/api/api.schemas';
import type { Tags } from './tag.type';

export function transformTagsDtoToTags(tagsDto: TagsDto): Tags {
  return tagsDto.tags;
}
