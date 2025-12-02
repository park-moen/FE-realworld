import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import type { MockedFunction } from 'vitest';
import { privateApi } from '~shared/api/api.instance';
import type { UserDto } from '~shared/api/api.schemas';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import type { LoginUser } from './login.schema';
import LoginForm from './login.ui';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('~shared/api/api.instance', () => ({
  privateApi: { post: vi.fn() },
}));

const mockedUseNavigate = useNavigate as MockedFunction<typeof useNavigate>;
const mockedApiPost = privateApi.post as MockedFunction<typeof privateApi.post>;

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
    mockedApiPost.mockResolvedValue({});

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalled();
    });
  });

  it('should navigate to profile on successful login', async () => {
    const navigate = vi.fn();

    mockedUseNavigate.mockReturnValue(navigate);
    mockedApiPost.mockResolvedValue({ data: mockUserDto });

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), mockLoginUser.email);
    await type(screen.getByPlaceholderText('Password'), mockLoginUser.password);
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('should display error message on login failure', async () => {
    mockedApiPost.mockRejectedValue(new Error('Request failed'));

    const { click, type } = renderLoginForm();

    await type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await type(screen.getByPlaceholderText('Password'), 'password123');
    await click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
    });
  });
});

function renderLoginForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>,
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
