import { api } from './api.instance';
import {
  LoginUserDtoSchema,
  RegisterUserDtoSchema,
  UserDtoSchema,
  type LoginUserDto,
  type RegisterUserDto,
  type UserDto,
} from './api.schemas';

export async function registerUser(registerUserDto: RegisterUserDto): Promise<UserDto> {
  const data = RegisterUserDtoSchema.parse(registerUserDto);
  const response = await api.post('/users', data);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function loginUser(loginUserDto: LoginUserDto): Promise<UserDto> {
  const data = LoginUserDtoSchema.parse(loginUserDto);
  const response = await api.post('users/login', data);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}
