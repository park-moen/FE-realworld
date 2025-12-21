import { request } from '@playwright/test';

const PLAYWRIGHT_API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000';

/**
 * API를 통해 사용자 생성
 */
export async function createUserByApi(data?: { username?: string; email?: string; password?: string }) {
  const context = await request.newContext({
    ignoreHTTPSErrors: true,
  });

  const uniqueSuffix = Date.now();
  const user = {
    username: `testuser_${uniqueSuffix}`,
    email: `testuser_${uniqueSuffix}@example.com`,
    password: 'testpassword123',
    ...data,
  };

  const response = await context.post(`${PLAYWRIGHT_API_URL}/users`, {
    data: { user },
  });

  if (!response.ok()) {
    throw new Error(`Failed to create user: ${response.status()}`);
  }

  const body = await response.json();
  await context.dispose();

  return {
    ...body.user,
    password: user.password,
  };
}
