import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { resetArticleStates } from '~shared/lib/mocks/handlers';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { articleQueryOptions } from '~entities/article/article.api';
import { UnfavoriteArticleBriefButton, UnfavoriteArticleExtendedButton } from './unfavorite-article.ui';

const TEST_SLUG = 'example-article';

describe('UnfavoriteArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetArticleStates();
  });

  describe('UnfavoriteArticleBriefButton', () => {
    it('should render the unfavorite button with correct count', async () => {
      renderFavoriteArticleBriefButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByRole('button'));
        expect(screen.getByText('42'));
      });
    });

    it('should trigger mutation and update unfavorite count when clicked', async () => {
      const { click } = renderFavoriteArticleBriefButtonWithQuery();

      await waitFor(() => expect(screen.getByText('42')));
      await click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('41')));
    });
  });

  describe('UnfavoriteArticleExtendedButton', () => {
    it('should render the unfavorite button with correct count', async () => {
      renderFavoriteArticleExtendedButtonWithQuery();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /unfavorite article/i }));
        expect(screen.getByText('42'));
      });
    });

    it('should trigger mutation and update unfavorite count when clicked', async () => {
      const { click } = renderFavoriteArticleExtendedButtonWithQuery();

      await waitFor(() => expect(screen.getByText('42')));
      await click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('41')));
    });
  });
});

function ParentWithQuery({
  ButtonComponent,
}: {
  ButtonComponent: typeof UnfavoriteArticleBriefButton | typeof UnfavoriteArticleExtendedButton;
}) {
  const { data: article } = useSuspenseQuery(articleQueryOptions(TEST_SLUG));

  return <ButtonComponent article={article} />;
}

function renderFavoriteArticleBriefButtonWithQuery() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ParentWithQuery ButtonComponent={UnfavoriteArticleBriefButton} />
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
        <ParentWithQuery ButtonComponent={UnfavoriteArticleExtendedButton} />
      </Suspense>
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
