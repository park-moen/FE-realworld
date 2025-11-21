import type { UserDto } from '~shared/api/api.schemas';
import type { User } from './session.type';

export function transformUserDtoToUser(userDto: UserDto): User {
  const { user } = userDto;

  return {
    email: user.email,
    token: user.token,
    username: user.username,
    image: user?.image ?? '',
    bio: user?.bio ?? '',
  };
}
