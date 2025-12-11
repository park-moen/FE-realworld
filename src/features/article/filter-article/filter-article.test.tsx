import { Suspense } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { sessionReducer } from '~entities/session/session.model';
import { PrimaryFilter, TagFilter, SecondaryFilter } from './filter-article.ui';

const API_URL = import.meta.env.VITE_API_URL;

describe('FilterArticle', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('PrimaryFilter', () => {
    it('should render tabs and update URL when clicked', async () => {
      const { router, click } = renderPrimaryFilter({ source: 'user', withSession: true });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Your Feed/i })).toBeInTheDocument();
      });

      await click(screen.getByRole('button', { name: /Global Feed/i }));

      expect(router.state.location.search).toContain('source=global');
    });

    it('should render tag tab when tag parameter exists', async () => {
      renderPrimaryFilter({ source: 'global', tag: 'react' });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /#react/i })).toBeInTheDocument();
      });
    });
  });

  describe('TagFilter', () => {
    it('should render tags and update URL when clicked', async () => {
      setupTagsMock(['react', 'typescript']);
      const { router, click } = renderTagFilter();

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });

      await click(screen.getByText('react'));

      expect(router.state.location.search).toContain('tag=react');
    });
  });

  describe('SecondaryFilter', () => {
    it('should render tabs and switch between author and favorited', async () => {
      const { router, click } = renderSecondaryFilter({ username: 'john', author: 'john' });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /john's Articles/i })).toBeInTheDocument();
      });

      await click(screen.getByRole('button', { name: /Favorited Articles/i }));

      expect(router.state.location.search).toContain('favorited=john');
    });

    it('should activate correct tab based on URL params', async () => {
      renderSecondaryFilter({ username: 'john', favorited: 'john' });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Favorited Articles/i })).toHaveClass('active');
      });
    });
  });
});

function setupTagsMock(tags: string[]) {
  server.use(http.get(`${API_URL}/tags`, () => HttpResponse.json({ tags })));
}

function createMockStore(withSession = false) {
  return configureStore({
    reducer: { session: sessionReducer },
    preloadedState: {
      session: withSession
        ? { username: 'testuser', email: 'test@example.com', token: 'mock-token', bio: '', image: '' }
        : null,
    },
  });
}

function createRouterWithStore(routes: any[], store: any, initialUrl = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialUrl] });
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  return { ...user, ...renderResult, router };
}

function renderPrimaryFilter(opts: { source: 'global' | 'user'; tag?: string; withSession?: boolean }) {
  const { source, tag, withSession = false } = opts;
  const store = createMockStore(withSession);
  const params = new URLSearchParams({ source, page: '1' });
  if (tag) params.set('tag', tag);

  return createRouterWithStore(
    [
      {
        path: '/',
        element: <PrimaryFilter />,
        loader: () => ({ context: { filterQuery: { source, tag: tag || null, page: 1, limit: 10 } } }),
      },
    ],
    store,
    `/?${params}`,
  );
}

function renderTagFilter() {
  const store = createMockStore();

  return createRouterWithStore(
    [
      {
        path: '/',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <TagFilter />
          </Suspense>
        ),
      },
    ],
    store,
  );
}

function renderSecondaryFilter(opts: { username: string; author?: string; favorited?: string }) {
  const { username, author, favorited } = opts;
  const store = createMockStore();
  const params = new URLSearchParams({ page: '1', limit: '10' });
  if (author) params.set('author', author);
  if (favorited) params.set('favorited', favorited);

  return createRouterWithStore(
    [
      {
        path: '/profile/:username',
        element: <SecondaryFilter />,
        loader: () => ({
          params: { username },
          context: {
            filterQuery: { source: 'global', author: author || null, favorited: favorited || null, page: 1, limit: 10 },
          },
        }),
      },
    ],
    store,
    `/profile/${username}?${params}`,
  );
}
