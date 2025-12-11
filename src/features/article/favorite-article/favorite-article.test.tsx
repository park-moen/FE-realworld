import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { resetArticleStates } from '~shared/lib/mocks/handlers';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { articleQueryOptions } from '~entities/article/article.api';
import { FavoriteArticleBriefButton, FavoriteArticleExtendedButton } from './favorite-article.ui';

const TEST_SLUG = 'example-article';

describe('FavoriteArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetArticleStates();
  });

  describe('FavoriteArticleBriefButton', () => {
    it('should render the favorite button with the correct count', async () => {
      renderFavoriteArticleBriefButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      const { click } = renderFavoriteArticleBriefButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      });

      await click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });
  });

  describe('FavoriteArticleExtendedButton', () => {
    it('should render the favorite with the correct count and text', async () => {
      renderFavoriteArticleExtendedButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Favorite Article/i }));
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    it('should trigger mutation and update favorites count when clicked', async () => {
      const { click } = renderFavoriteArticleBriefButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      });

      await click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });
    });
  });
});

function ParentWithQuery({ ButtonComponent }: { ButtonComponent: typeof FavoriteArticleBriefButton }) {
  const { data: article } = useSuspenseQuery(articleQueryOptions(TEST_SLUG));

  return <ButtonComponent article={article} />;
}

function renderFavoriteArticleBriefButtonWithQuery() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ParentWithQuery ButtonComponent={FavoriteArticleBriefButton} />
      </Suspense>
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}

function renderFavoriteArticleExtendedButtonWithQuery() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ParentWithQuery ButtonComponent={FavoriteArticleExtendedButton} />
      </Suspense>
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
