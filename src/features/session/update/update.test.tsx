import { Suspense } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { UpdateSessionForm } from './update.ui';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return { ...actual, useNavigate: vi.fn() };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('UpdateSessionForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should render the form with user details', async () => {
    renderUpdateSessionForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL of profile picture'));
      expect(screen.getByPlaceholderText('Your Name'));
      expect(screen.getByPlaceholderText('Short bio about you'));
      expect(screen.getByPlaceholderText('Email'));
      expect(screen.getByPlaceholderText('Password'));
    });
  });

  it('should display validation errors if form is submitted with invalid data', async () => {
    const { click, type } = renderUpdateSessionForm();

    const emailInput = await screen.findByPlaceholderText('Email');
    const submitButton = await screen.findByRole('button', { name: /update settings/i });

    expect(emailInput).toHaveValue('test@example.com');

    await type(emailInput, 'invalid-email');
    await click(submitButton);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should call the mutation function with form data when submitted', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    const { click, type, clear } = renderUpdateSessionForm();

    const emailInput = await screen.findByPlaceholderText('Email');
    const usernameInput = await screen.findByPlaceholderText('Your Name');
    const submitButton = await screen.findByRole('button', { name: /update settings/i });

    expect(emailInput).toHaveValue('test@example.com');
    expect(usernameInput).toHaveValue('testuser');

    await clear(usernameInput);
    await type(usernameInput, 'changed-username');
    await click(submitButton);

    expect(usernameInput).toHaveValue('changed-username');
    expect(navigate).toHaveBeenCalled();
  });
});

function renderUpdateSessionForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdateSessionForm />
      </Suspense>
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
