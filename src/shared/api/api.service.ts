import type { AxiosRequestConfig } from 'axios';
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

// ! 엔드포인트 users/user -> user로 변경해야함. real world docs 엔드포인트는 user로 지정함.
export async function getUser(config?: AxiosRequestConfig): Promise<UserDto> {
  const response = await api.get('/users/user', config);
  const parsedResponse = UserDtoSchema.parse(response);

  return parsedResponse;
}
