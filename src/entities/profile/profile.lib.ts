import type { ProfileDto } from '~shared/api/api.schemas';
import type { Profile } from './profile.type';

export function transformProfileDtoToProfile(profileDto: ProfileDto): Profile {
  const { profile } = profileDto;

  return {
    ...profile,
    image: profile.image ?? '',
    bio: profile.bio ?? '',
  };
}
