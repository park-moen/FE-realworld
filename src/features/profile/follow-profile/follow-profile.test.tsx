import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { FollowUserButton } from './follow.profile.ui';

const TEST_USERNAME = 'testuser';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

describe('FollowUserButton Component', () => {
  it('should display the button with the correct text', () => {
    renderFollowUserButton();

    expect(screen.getByRole('button', { name: `Follow ${TEST_USERNAME}` })).toBeInTheDocument();
  });

  it('should successfully follow user and call API with correct username', async () => {
    const { click } = renderFollowUserButton();
    let capturedUsername = '';

    server.use(
      http.post(`${API_URL}/profiles/:username/follow`, ({ params }) => {
        capturedUsername = params.username as string;

        return HttpResponse.json({
          profile: {
            username: params.username,
            bio: 'Test bio',
            image: 'https://api.realworld.io/images/demo-avatar.png',
            following: true,
          },
        });
      }),
    );

    const followButton = screen.getByRole('button', { name: `Follow ${TEST_USERNAME}` });
    await click(followButton);

    await waitFor(() => {
      expect(capturedUsername).toBe(TEST_USERNAME);
      expect(followButton).toBeInTheDocument();
    });
  });
});

function renderFollowUserButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <FollowUserButton username={TEST_USERNAME} />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
