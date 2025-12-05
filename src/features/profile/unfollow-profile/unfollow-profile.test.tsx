import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { privateApi } from '~shared/api/api.instance';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { UnfollowUserProfile } from './unfollow-profile.ui';

vi.mock('~shared/api/api.instance', () => ({
  privateApi: { delete: vi.fn() },
}));

const mockedApiDelete = privateApi.delete as MockedFunction<typeof privateApi.delete>;

const username = 'mockUser';

describe('UnfollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderUnfollowUserButton();

    expect(screen.getByRole('button', { name: `Unfollow ${username}` })).toBeInTheDocument();
  });

  it('should call the mutate function with the unfollowed profile when clicked', async () => {
    mockedApiDelete.mockResolvedValue({});

    const { click } = renderUnfollowUserButton();

    await click(screen.getByRole('button', { name: `Unfollow ${username}` }));
    await waitFor(() => {
      expect(mockedApiDelete).toHaveBeenCalled();
    });
  });
});

function renderUnfollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <UnfollowUserProfile username={username} />
    </BrowserRouter>,
  );

  return { ...user, renderResult };
}
