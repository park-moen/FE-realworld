import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import type { UserDto } from '~shared/api/api.schemas';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import type { RegisterUser } from './register.schema';
import RegisterForm from './register.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the registration form', () => {
    renderRegisterForm();

    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), 'test');
    await type(screen.getByPlaceholderText('Email'), 'test');
    await type(screen.getByPlaceholderText('Password'), 'test');
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(3);
    });
  });

  it('submits the form and navigates to profile page on successful registration', async () => {
    let apiCalled = false;

    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    server.use(
      http.post(`${API_URL}/users`, () => {
        apiCalled = true;

        return HttpResponse.json(mockUserDto);
      }),
    );

    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), mockRegisterUser.username);
    await type(screen.getByPlaceholderText('Email'), mockRegisterUser.email);
    await type(screen.getByPlaceholderText('Password'), mockRegisterUser.password);
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(apiCalled).toBe(true);
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('displays errors message on registration failure', async () => {
    server.use(
      http.post(`${API_URL}/users`, () =>
        HttpResponse.json(
          {
            errors: {
              body: ['User body is required'],
            },
          },
          { status: 401 },
        ),
      ),
    );

    const { click, type } = renderRegisterForm();

    await type(screen.getByPlaceholderText('Your Name'), mockRegisterUser.username);
    await type(screen.getByPlaceholderText('Email'), mockRegisterUser.email);
    await type(screen.getByPlaceholderText('Password'), mockRegisterUser.password);
    await click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const errorList = screen.getByRole('list');
      expect(errorList).toHaveClass('error-messages');
    });
  });
});

const mockUserDto: UserDto = {
  user: {
    email: 'mockuser@example.com',
    token: 'mock-jwt-token-12345',
    username: 'mockuser',
    bio: 'This is a mock bio of the user.',
    image: 'https://example.com/mockuser-image.jpg',
  },
};

const mockRegisterUser: RegisterUser = {
  username: 'mockuser',
  email: 'mockuser@example.com',
  password: 'mockuserpassword',
};

function renderRegisterForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}
