import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { DeleteCommentButton } from './delete-comment.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TEST_SLUG = 'test-article-slug';
const TEST_COMMENT_ID = 'comment-123';

describe('Delete Comment Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the delete button with correct attributes', () => {
    renderDeleteCommentButton();
    const deleteButton = screen.getByRole('button');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('data-test', 'comment-delete-button');
  });

  it('should successfully delete comment with correct parameters', async () => {
    let apiCalled = false;
    let capturedSlug = '';
    let capturedCommentId = '';

    server.use(
      http.delete(`${API_URL}/articles/:slug/comments/:id`, ({ params }) => {
        apiCalled = true;
        capturedSlug = params.slug as string;
        capturedCommentId = params.id as string;

        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { click } = renderDeleteCommentButton();
    const deleteButton = screen.getByRole('button');

    await click(deleteButton);
    await waitFor(() => {
      expect(apiCalled).toBe(true);
      expect(capturedSlug).toBe(TEST_SLUG);
      expect(capturedCommentId).toBe(TEST_COMMENT_ID);
    });
  });
});

function renderDeleteCommentButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <DeleteCommentButton slug={TEST_SLUG} commentId={TEST_COMMENT_ID} />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
