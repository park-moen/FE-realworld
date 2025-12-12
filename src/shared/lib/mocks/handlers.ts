import { randomUUID } from 'crypto';
import { http, HttpResponse } from 'msw';

interface IUserLoginRequest {
  user: {
    email: string;
    password: string;
  };
}

interface IUserUpdateRequest {
  user: {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    image?: string;
  };
}

interface IUserRegisterRequest {
  user: {
    username: string;
    email: string;
    bio: string | null;
    image: string | null;
  };
}

interface IArticleCreateRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

type IArticleUpdateRequest = Partial<IArticleCreateRequest>;

const API_URL = import.meta.env.VITE_API_URL;
const articleStates = new Map<string, { favorited: boolean; favoritesCount: number }>();

export const handlers = [
  http.get(`${API_URL}/users/user`, () =>
    HttpResponse.json({
      user: {
        username: 'testuser',
        email: 'test@example.com',
        token: 'mock-jwt-token',
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
      },
    }),
  ),

  http.post(`${API_URL}/users`, async ({ request }) => {
    const {
      user: { username, email, bio, image },
    } = (await request.json()) as IUserRegisterRequest;

    return HttpResponse.json({
      user: {
        username,
        email,
        token: 'mock-jwt-token',
        bio: bio ?? '',
        image: image ?? '',
      },
    });
  }),

  http.post(`${API_URL}/users/login`, async ({ request }) => {
    const {
      user: { email },
    } = (await request.json()) as IUserLoginRequest;

    return HttpResponse.json({
      user: {
        username: 'testuser',
        email,
        token: 'mock-jwt-token',
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
      },
    });
  }),

  http.put(`${API_URL}/users/user`, async ({ request }) => {
    const {
      user: { username, email, bio, image },
    } = (await request.json()) as IUserUpdateRequest;

    return HttpResponse.json({
      user: {
        username,
        email,
        token: 'mock-jwt-token',
        bio: bio ?? null,
        image: image ?? null,
      },
    });
  }),

  http.post(`${API_URL}/profiles/:username/follow`, async ({ params }) =>
    HttpResponse.json({
      profile: {
        username: params.username,
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: true,
      },
    }),
  ),

  http.delete(`${API_URL}/profiles/:username/follow`, async ({ params }) =>
    HttpResponse.json({
      profile: {
        username: params.username,
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: false,
      },
    }),
  ),

  http.post(`${API_URL}/articles`, async ({ request }) => {
    const {
      article: { title, description, body, tagList },
    } = (await request.json()) as IArticleCreateRequest;
    const slug = title.toLocaleLowerCase().replace(/\s+/g, '-');

    return HttpResponse.json({
      article: {
        slug,
        title,
        description,
        body,
        tags: tagList || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 42,
        author: {
          username: 'testUser',
          bio: 'This is a mock bio of the author.',
          image: 'https://example.com/mock-image.jpg',
        },
      },
    });
  }),

  http.put(`${API_URL}/articles/:slug`, async ({ request }) => {
    const { article } = (await request.json()) as IArticleUpdateRequest;
    const slug = article?.title.toLocaleLowerCase().replace(/\s+/g, '-');

    return HttpResponse.json({
      article: {
        slug,
        title: article?.title,
        description: article?.description,
        body: article?.body,
        tags: article?.tagList || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 42,
        author: {
          username: 'testUser',
          bio: 'This is a mock bio of the author.',
          image: 'https://example.com/mock-image.jpg',
        },
      },
    });
  }),

  http.delete(`${API_URL}/articles/:slug`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API_URL}/articles/:slug`, ({ params }) => {
    const slug = params.slug as string;
    const state = articleStates.get(slug) || { favorited: false, favoritesCount: 42 };

    return HttpResponse.json({
      article: {
        slug,
        title: 'Example Article Title',
        description: 'This is a mock description of the article',
        body: 'This is the body of the mock article. It contains details content.',
        tags: ['mock', 'test', 'articles'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: state.favorited,
        favoritesCount: state.favoritesCount,
        author: {
          username: 'mockUser',
          bio: 'This is a mock bio of the author.',
          image: 'https://example.com/mock-image.jpg',
        },
      },
    });
  }),

  http.post(`${API_URL}/articles/:slug/favorite`, ({ params }) => {
    const slug = params.slug as string;
    const currentState = articleStates.get(slug) || { favorited: false, favoritesCount: 42 };
    const newState = {
      favorited: true,
      favoritesCount: currentState.favorited ? currentState.favoritesCount : currentState.favoritesCount + 1,
    };

    articleStates.set(slug, newState);

    return HttpResponse.json({
      article: {
        slug,
        title: 'Example Article Title',
        description: 'This is a mock description of the article',
        body: 'This is the body of the mock article. It contains details content.',
        tags: ['mock', 'test', 'articles'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: newState.favorited,
        favoritesCount: newState.favoritesCount,
        author: {
          username: 'mockUser',
          bio: 'This is a mock bio of the author.',
          image: 'https://example.com/mock-image.jpg',
        },
      },
    });
  }),

  http.delete(`${API_URL}/articles/:slug/favorite`, ({ params }) => {
    const slug = params.slug as string;
    const currentState = articleStates.get(slug) || { favorited: false, favoritesCount: 42 };
    const newState = {
      favorited: false,
      favoritesCount: currentState.favorited ? currentState.favoritesCount : currentState.favoritesCount - 1,
    };

    articleStates.set(slug, newState);

    return HttpResponse.json({
      article: {
        slug,
        title: 'Example Article Title',
        description: 'This is a mock description of the article',
        body: 'This is the body of the mock article. It contains details content.',
        tags: ['mock', 'test', 'articles'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: newState.favorited,
        favoritesCount: newState.favoritesCount,
        author: {
          username: 'mockUser',
          bio: 'This is a mock bio of the author.',
          image: 'https://example.com/mock-image.jpg',
        },
      },
    });
  }),

  http.post(`${API_URL}/articles/:slug/comments`, async ({ request }) => {
    const body = await request.json();
    const commentBody = (body as { comment: { body: string } }).comment.body;

    return HttpResponse.json({
      comment: {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        body: commentBody,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: 'https://api.realworld.io/images/demo-avatar.png',
          following: false,
        },
      },
    });
  }),

  http.delete(`${API_URL}/articles/:slug/comments/:id`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API_URL}/articles/:slug/comments`, () =>
    HttpResponse.json({
      comments: [],
    }),
  ),
];

export function resetArticleStates() {
  articleStates.clear();
}
