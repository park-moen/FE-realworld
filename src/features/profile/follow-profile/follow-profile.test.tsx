import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { privateApi } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { FollowUserButton } from './follow.profile.ui';

vi.mock('~shared/api/api.instance', () => ({
  privateApi: { post: vi.fn() },
}));

const mockedApiPost = privateApi.post as MockedFunction<typeof privateApi.post>;

const username = 'mockUser';

describe('FollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderFollowUserButton();

    expect(screen.getByRole('button', { name: `Follow ${username}` })).toBeInTheDocument();
  });

  it('should call the mutate function with the followed profile when clicked', async () => {
    mockedApiPost.mockResolvedValue({});

    const { click } = renderFollowUserButton();

    await click(screen.getByRole('button', { name: `Follow ${username}` }));

    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalled();
    });
  });
});

function renderFollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <FollowUserButton username={username} />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
