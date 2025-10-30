import { api } from './api.instance';
import { RegisterUserDtoSchema, UserDtoSchema, type RegisterUserDto, type UserDto } from './api.schemas';

export async function registerUser(registerUserDto: RegisterUserDto): Promise<UserDto> {
  const data = RegisterUserDtoSchema.parse(registerUserDto);
  const response = await api.post('/users', data);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}
