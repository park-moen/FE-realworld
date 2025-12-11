import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { articleQueryOptions } from '~entities/article/article.api';
import { DeleteArticleButton } from './delete-article.ui';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return { ...actual, useNavigate: vi.fn() };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;
const TEST_SLUG = 'example-article';

describe('DeleteArticleButton', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should render the delete button', async () => {
    renderDeleteArticleButtonWithQuery();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete article/i })).toBeInTheDocument();
    });
  });

  it('should navigate to the home page on successful mutation', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    const { click } = renderDeleteArticleButtonWithQuery();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete article/i })).toBeInTheDocument();
    });

    await click(screen.getByRole('button', { name: /delete article/i }));
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});

function ParentWithQuery({ ButtonComponent }: { ButtonComponent: typeof DeleteArticleButton }) {
  const { data: article } = useSuspenseQuery(articleQueryOptions(TEST_SLUG));

  return <ButtonComponent slug={article.slug} />;
}

function renderDeleteArticleButtonWithQuery() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ParentWithQuery ButtonComponent={DeleteArticleButton} />
      </Suspense>
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
