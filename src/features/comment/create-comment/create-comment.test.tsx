// src/features/create-comment/create-comment.ui.test.tsx
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '~shared/lib/mocks/server';
import { renderWithQueryClient } from '~shared/lib/test/test.lib';
import { CreateCommentForm } from './create-comment.ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

describe('reate Comment Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the textarea, avatar, submitButton', async () => {
    renderCreateCommentForm();

    // 사용자 정보가 로드되면 폼이 표시됨
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    });

    // 사용자 아바타 확인
    const avatar = screen.getByRole('img', { name: /testuser/i });
    expect(avatar).toHaveAttribute('src', expect.stringContaining('demo-avatar.png'));

    // 제출 버튼 초기 상태 확인 (비활성화)
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    expect(submitButton).toBeDisabled();
  });

  it('should form entry and validation', async () => {
    const { type } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /post comment/i }));
    });

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    // 초기 상태: 버튼 비활성화
    expect(submitButton).toBeDisabled();

    // 텍스트 입력
    await type(textarea, 'This is a test comment');

    // 버튼 활성화 확인
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should display validation error', async () => {
    const { type, clear } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write a comment/i);

    // 텍스트 입력 후 삭제
    await type(textarea, 'Test');
    await clear(textarea);

    // 유효성 검증 에러 메시지 확인
    await waitFor(() => {
      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should clear the textarea after successful submission', async () => {
    const { click, type } = renderCreateCommentForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    const commentText = 'This is my awesome comment!';
    await type(textarea, commentText);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // 폼 제출
    await click(submitButton);

    // 제출 완료 후 폼 초기화 확인
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('should display error messages if the mutation fails', async () => {
    const { click, type } = renderCreateCommentForm();

    server.use(
      http.post(`${API_URL}/articles/:slug/comments`, () =>
        HttpResponse.json(
          {
            errors: {
              body: ['Comment body is required'],
            },
          },
          { status: 422 },
        ),
      ),
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    await type(textarea, 'Test comment');
    await click(submitButton);

    await waitFor(() => {
      const errorList = screen.getByRole('list');
      expect(errorList).toHaveClass('error-message');
    });
  });
});

function renderCreateCommentForm() {
  const user = userEvent.setup();
  const renderResult = renderWithQueryClient(
    <BrowserRouter>
      <CreateCommentForm slug="test-slug" />
    </BrowserRouter>,
  );

  return { ...user, ...renderResult };
}
