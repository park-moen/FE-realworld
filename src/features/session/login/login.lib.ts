import type { LoginUserDto } from '~shared/api/api.schemas';
import type { LoginUser } from './login.schema';

export function transformLoginUserToLoginUserDto(loginUser: LoginUser): LoginUserDto {
  const { email, password } = loginUser;

  return {
    user: { email, password },
  };
}
