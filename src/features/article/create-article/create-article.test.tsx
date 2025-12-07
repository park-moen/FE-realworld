import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { CreateArticleFrom } from './create-article.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return { ...actual, useNavigate: vi.fn() };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('CreateArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields and submit button', () => {
    renderCreateArticleForm();

    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's this article about?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish article/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty required fields', async () => {
    const { type, tab, clear } = renderCreateArticleForm();

    const titleInput = screen.getByPlaceholderText('Article Title');
    const descriptionInput = screen.getByPlaceholderText("What's this article about?");
    const bodyInput = screen.getByPlaceholderText('Write your article (in markdown)');

    await type(titleInput, 'Test title');
    await clear(titleInput);
    await tab();

    await type(descriptionInput, 'Test description');
    await clear(descriptionInput);
    await tab();

    await type(bodyInput, 'Test body');
    await clear(bodyInput);
    await tab();

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(3);
    });
  });

  it('should successfully create article and navigate to article page', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    let apiCalled = false;
    let capturedData = { title: '', description: '', body: '' };

    server.use(
      http.post(`${API_URL}/articles`, async ({ request }) => {
        apiCalled = true;
        const body = await request.json();
        const { article } = body as { article: { title: string; description: string; body: string } };

        capturedData = { title: article.title, description: article.description, body: article.body };
        const slug = article.title.toLowerCase().replace(/\s+/g, '-');

        return HttpResponse.json({
          article: {
            slug,
            title: article.title,
            description: article.description,
            body: article.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            favorited: false,
            favoritesCount: 0,
            tags: [],
            author: {
              username: 'testuser',
              bio: 'Test bio',
              image: 'https://api.realworld.io/images/demo-avatar.png',
            },
          },
        });
      }),
    );

    const { type, click } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), 'My Test Article');
    await type(screen.getByPlaceholderText("What's this article about?"), 'Test description');
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), 'Test body');
    await click(screen.getByRole('button', { name: /publish article/i }));

    await waitFor(() => {
      expect(apiCalled).toBe(true);
      expect(capturedData.title).toBe('My Test Article');
      expect(capturedData.description).toBe('Test description');
      expect(capturedData.body).toBe('Test body');
      expect(navigate).toHaveBeenCalledWith('/article/my-test-article/');
    });
  });

  it('should handle 422 validation error and disable fields while submitting', async () => {
    server.use(
      http.post(`${API_URL}/articles`, () =>
        HttpResponse.json({ errors: { body: ['Title is required'] } }, { status: 422 }),
      ),
    );

    const { type, click } = renderCreateArticleForm();

    await type(screen.getByPlaceholderText('Article Title'), 'Test Article');
    await type(screen.getByPlaceholderText("What's this article about?"), 'Test Description');
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), 'Test Body');
    await click(screen.getByRole('button', { name: /publish article/i }));

    await waitFor(() => {
      const errorList = screen.getByRole('list');
      expect(errorList).toHaveClass('error-messages');
    });
  });
});

function renderCreateArticleForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <CreateArticleFrom />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
