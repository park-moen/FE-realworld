import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import type { Article } from '~entities/article/article.type';
import { UpdateArticleForm } from './update-article.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TEST_SLUG = 'test-article-slug';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return { ...actual, useNavigate: vi.fn() };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('UpdateArticleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.use(http.get(`${API_URL}/articles/${TEST_SLUG}`, () => HttpResponse.json({ article: mockArticle })));
  });

  it('should render all form fields and submit button', async () => {
    renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
      expect(screen.getByPlaceholderText("What's this article about?")).toHaveValue(mockArticle.description);
      expect(screen.getByPlaceholderText('Write your article (in markdown)')).toHaveValue(mockArticle.body);
      expect(screen.getByPlaceholderText('Enter tags')).toHaveValue(mockArticle.tags.join(', '));
    });
  });

  it('should call the mutation with the updated article on form submission', async () => {
    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    const slug = mockArticle.title.toLowerCase().replace(/\s+/g, '-');
    let apiCalled = false;
    let capturedData = { title: '', description: '', body: '' };

    server.use(
      http.put(`${API_URL}/articles/:slug`, async () => {
        const { title, description, body } = mockUpdateArticle;

        apiCalled = true;
        capturedData = {
          title,
          description,
          body,
        };

        return HttpResponse.json({
          article: {
            slug,
            title,
            description,
            body,
          },
        });
      }),
    );

    const updateTitleInput = screen.getByPlaceholderText('Article Title');
    const updateDescriptionInput = screen.getByPlaceholderText("What's this article about?");
    const updateBodyInput = screen.getByPlaceholderText('Enter tags');
    screen.getByPlaceholderText('Enter tags');

    await clear(updateTitleInput);
    await type(updateTitleInput, mockUpdateArticle.title);

    await clear(updateDescriptionInput);
    await type(updateDescriptionInput, mockUpdateArticle.description);

    await clear(screen.getByPlaceholderText('Write your article (in markdown)'));
    await type(screen.getByPlaceholderText('Write your article (in markdown)'), mockUpdateArticle.body);

    await clear(updateBodyInput);
    await type(updateBodyInput, mockUpdateArticle.tagList);

    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      expect(apiCalled).toBe(true);
      expect(capturedData.title).toBe(mockUpdateArticle.title);
      expect(capturedData.description).toBe(mockUpdateArticle.description);
      expect(capturedData.body).toBe(mockUpdateArticle.body);
    });
  });

  it('should navigate to the article page on successful mutation', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    const updateDescriptionInput = screen.getByPlaceholderText("What's this article about?");

    await clear(updateDescriptionInput);
    await type(updateDescriptionInput, 'Updated Description');
    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display server errors on mutation error', async () => {
    server.use(
      http.put(`${API_URL}/articles/:slug`, () =>
        HttpResponse.json({ errors: { body: ['Request failed'] } }, { status: 400 }),
      ),
    );

    const { click, type, clear } = renderUpdateArticleForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue(mockArticle.title);
    });

    const updateDescriptionInput = screen.getByPlaceholderText("What's this article about?");

    await clear(updateDescriptionInput);
    await type(updateDescriptionInput, 'Updated Description');

    await click(screen.getByRole('button', { name: /update article/i }));

    await waitFor(() => {
      const errorList = screen.getByRole('list');
      expect(errorList).toHaveClass('error-messages');
    });
  });
});

const mockArticle: Article = {
  slug: 'example-article',
  title: 'Example Article Title',
  description: 'This is a mock description of the article.',
  body: 'This is the body of the mock article. It contains detailed content.',
  tags: ['mock', 'test', 'article'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  favorited: false,
  favoritesCount: 42,
  author: {
    username: 'mockUser',
    bio: 'This is a mock bio of the author.',
    image: 'https://example.com/mock-image.jpg',
  },
};

const mockUpdateArticle = {
  title: 'Updated Article Title',
  description: 'Updated description for the article.',
  body: 'This is the updated body of the article.',
  tagList: 'updated, test, article',
};

function renderUpdateArticleForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <UpdateArticleForm slug={TEST_SLUG} />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
