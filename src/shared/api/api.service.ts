import { type AxiosRequestConfig } from 'axios';
import { logger } from '~shared/lib/utils';
import { privateApi, publicApi } from './api.instance';
import {
  ArticleDtoSchema,
  ArticlesDtoSchema,
  CommentDtoSchema,
  CommentsDtoSchema,
  CreateArticleDtoSchema,
  CreateCommentDtoSchema,
  LoginUserDtoSchema,
  ProfileDtoSchema,
  RefreshResponseDtoSchema,
  RegisterUserDtoSchema,
  TagsDtoSchema,
  UpdateArticleDtoSchema,
  UserDtoSchema,
  type ArticleDto,
  type ArticlesDto,
  type CommentsDto,
  type CreateArticleDto,
  type CreateCommentDto,
  type LoginUserDto,
  type ProfileDto,
  type RefreshResponseDto,
  type RegisterUserDto,
  type TagsDto,
  type UpdateArticleDto,
  type UserDto,
} from './api.schemas';

export async function registerUser(registerUserDto: RegisterUserDto): Promise<UserDto> {
  const data = RegisterUserDtoSchema.parse(registerUserDto);
  const response = await publicApi.post('/users', data);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function loginUser(loginUserDto: LoginUserDto): Promise<UserDto> {
  const data = LoginUserDtoSchema.parse(loginUserDto);
  const response = await privateApi.post('users/login', data);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}

// ! 엔드포인트 users/user -> user로 변경해야함. real world docs 엔드포인트는 user로 지정함.
export async function getUser(config?: AxiosRequestConfig): Promise<UserDto> {
  const response = await privateApi.get('/users/user', config);
  const parsedResponse = UserDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function refreshAccessToken(): Promise<RefreshResponseDto> {
  logger.tokenRefreshStart('/users/refresh');

  try {
    const response = await privateApi.post(
      '/users/refresh',
      {},
      {
        withCredentials: true,
      },
    );

    const parsedResponse = RefreshResponseDtoSchema.parse(response.data);

    logger.tokenRefreshSuccess('/users/refresh');
    logger.info('🔑 New Access Token issued');

    return parsedResponse;
  } catch (error) {
    logger.tokenRefreshFailed(error);
    throw error;
  }
}

export async function getProfileByUsername(username: string, config?: AxiosRequestConfig): Promise<ProfileDto> {
  const response = await privateApi.get(`/profiles/${username}`, config);
  const parsedResponse = ProfileDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function followProfile(username: string, config?: AxiosRequestConfig): Promise<ProfileDto> {
  const response = await privateApi.post(`/profiles/${username}/follow`, {}, config);
  const parsedResponse = ProfileDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function unfollowProfile(username: string, config?: AxiosRequestConfig): Promise<ProfileDto> {
  const response = await privateApi.delete(`/profiles/${username}/follow`, config);
  const parsedResponse = ProfileDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function getArticleBySlug(slug: string, config?: AxiosRequestConfig): Promise<ArticleDto> {
  const response = await privateApi.get(`/articles/${slug}`, config);
  const parsedResponse = ArticleDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function getAllArticles(config?: AxiosRequestConfig): Promise<ArticlesDto> {
  const response = await privateApi.get('/articles', config);
  const parsedResponse = ArticlesDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function getFeedArticles(config?: AxiosRequestConfig): Promise<ArticlesDto> {
  const response = await privateApi.get('/articles/feed', config);
  const parsedResponse = ArticlesDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function createArticle(
  createArticleDto: CreateArticleDto,
  config?: AxiosRequestConfig,
): Promise<ArticleDto> {
  const data = CreateArticleDtoSchema.parse(createArticleDto);
  const response = await privateApi.post('/articles', data, config);
  const parsedResponse = ArticleDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function updateArticle(
  slug: string,
  updateArticleDto: UpdateArticleDto,
  config?: AxiosRequestConfig,
): Promise<ArticleDto> {
  const data = UpdateArticleDtoSchema.parse(updateArticleDto);
  const response = await privateApi.put(`/articles/${slug}`, data, config);
  const parsedResponse = ArticleDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function favoriteArticle(slug: string, config?: AxiosRequestConfig): Promise<ArticleDto> {
  const response = await privateApi.post(`/articles/${slug}/favorite`, {}, config);
  const parsedResponse = ArticleDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function unfavoriteArticle(slug: string, config?: AxiosRequestConfig): Promise<ArticleDto> {
  const response = await privateApi.delete(`/articles/${slug}/favorite`, config);
  const parsedResponse = ArticleDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function getAllCommentsBySlug(slug: string, config?: AxiosRequestConfig): Promise<CommentsDto> {
  const response = await privateApi.get(`/articles/${slug}/comments`, config);
  const parsedResponse = CommentsDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function createComment(slug: string, createCommentDto: CreateCommentDto, config?: AxiosRequestConfig) {
  const data = CreateCommentDtoSchema.parse(createCommentDto);
  const response = await privateApi.post(`/articles/${slug}/comments`, data, config);
  const parsedResponse = CommentDtoSchema.parse(response.data);

  return parsedResponse;
}

export async function deleteComment(slug: string, commentId: string, config?: AxiosRequestConfig) {
  return privateApi.delete(`/articles/${slug}/comments/${commentId}`, config);
}

export async function getAllTags(config?: AxiosRequestConfig): Promise<TagsDto> {
  const response = await publicApi.get('/tags', config);
  const parsedResponse = TagsDtoSchema.parse(response.data);

  return parsedResponse;
}
