import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { LogoutButton } from './logout.ui';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return { ...actual, useNavigate: vi.fn() };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('LogoutButton', () => {
  beforeAll(() => vi.clearAllMocks());

  it('should navigate to home on successful logout', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    const { click } = renderLogoutButton();

    await click(screen.getByRole('button', { name: /click here to logout/i }));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});

function renderLogoutButton() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <LogoutButton />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
