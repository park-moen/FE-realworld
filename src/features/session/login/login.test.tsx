import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import type { UserDto } from '~shared/api/api.schemas';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import type { LoginUser } from './login.schema';
import LoginForm from './login.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays validation errors when form fields are invalid', async () => {
    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), 'test');
    await type(screen.getByPlaceholderText('Password'), 'test');
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
  });

  it('should call login mutation on valid form submission', async () => {
    let apiCalled = false;

    server.use(
      http.post(`${API_URL}/users/login`, async ({ request }) => {
        apiCalled = true;
        const body = await request.json();
        const { user } = body as { user: { email: string; password: string } };

        return HttpResponse.json({
          user: {
            username: 'testuser',
            email: user.email,
            token: 'mock-jwt-token',
            bio: 'Test bio',
            image: 'https://api.realworld.io/images/demo-avatar.png',
          },
        });
      }),
    );

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(apiCalled).toBe(true);
    });
  });

  it('should navigate to profile on successful login', async () => {
    const navigate = vi.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    server.use(http.post(`${API_URL}/users/login`, () => HttpResponse.json(mockUserDto)));

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display error message on login failure', async () => {
    server.use(
      http.post(`${API_URL}/users/login`, () =>
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

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await type(screen.getByPlaceholderText('Password'), 'password123');
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      const errorList = screen.getByRole('list');
      expect(errorList).toHaveClass('error-messages');
    });
  });
});

function renderLoginForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

  return { ...user, ...renderResult };
}

const mockLoginUser: LoginUser = {
  email: 'mockuser@xeample.com',
  password: 'mockuserpassword',
};

const mockUserDto: UserDto = {
  user: {
    email: 'mockuser@example.com',
    token: 'mock-jwt-token-12345',
    username: 'mockuser',
    bio: 'This is a mock bio of the user.',
    image: 'https://example.com/mockuser-image.jpg',
  },
};
