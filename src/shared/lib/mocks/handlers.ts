import { randomUUID } from 'crypto';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

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

  http.get(`${API_URL}/articles/:slug/comments`, () =>
    HttpResponse.json({
      comments: [],
    }),
  ),
];
