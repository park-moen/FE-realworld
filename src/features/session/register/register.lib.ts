import type { RegisterUserDto } from '~shared/api/api.schemas';
import type { RegisterUser } from './register.schema';

export function transformRegisterUserToRegisterUserDto(registerUser: RegisterUser): RegisterUserDto {
  const { username, email, password } = registerUser;

  return {
    user: { username, email, password },
  };
}
