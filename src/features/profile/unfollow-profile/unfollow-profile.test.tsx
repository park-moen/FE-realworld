import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { UnfollowUserProfile } from './unfollow-profile.ui';

const TEST_USERNAME = 'testuser';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

describe('UnfollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderUnfollowUserButton();

    expect(screen.getByRole('button', { name: `Unfollow ${TEST_USERNAME}` })).toBeInTheDocument();
  });

  it('should successfully unfollow user and call API with correct username', async () => {
    const { click } = renderUnfollowUserButton();
    let capturedUsername = '';

    server.use(
      http.delete(`${API_URL}/profiles/:username/follow`, async ({ params }) => {
        capturedUsername = params.username as string;

        return HttpResponse.json({
          profile: {
            username: params.username,
            bio: 'Test bio',
            image: 'https://api.realworld.io/images/demo-avatar.png',
            following: false,
          },
        });
      }),
    );

    const unfollowButton = screen.getByRole('button', { name: `Unfollow ${TEST_USERNAME}` });
    await click(unfollowButton);

    await waitFor(() => {
      expect(capturedUsername).toBe(TEST_USERNAME);
      expect(unfollowButton).toBeInTheDocument();
    });
  });
});

function renderUnfollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <UnfollowUserProfile username={TEST_USERNAME} />
    </MemoryRouter>,
  );

  return { ...user, renderResult };
}
