import type { UpdateUserDto } from '~shared/api/api.schemas';
import type { Profile } from '~entities/profile/profile.type';
import type { User } from '~entities/session/session.type';
import type { UpdateUser } from './update.type';

export function transformUpdateUserToUpdateUserDto(updateUser: UpdateUser): UpdateUserDto {
  const { username, email, password, bio, image } = updateUser;

  return {
    user: {
      username,
      email,
      password,
      bio,
      image,
    },
  };
}

export function transformUpdateUserToProfile(user: User): Profile {
  const { username, image, bio } = user;

  return {
    username,
    image,
    bio,
    following: false,
  };
}
