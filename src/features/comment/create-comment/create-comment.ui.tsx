import { Suspense } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '~shared/lib/utils';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { useCreateCommentMutation } from './create-comment-mutation';
import { CreateCommentSchema } from './create-comment.contracts';
import { CreateCommentFormSkeleton } from './create-comment.skeleton';
import type { CreateComment } from './create-comment.type';

interface CreateCommentFormProps {
  slug: string;
}

export function CreateCommentForm(props: CreateCommentFormProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<CreateCommentFormSkeleton />}>
        <BaseCreateCommentFrom {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseCreateCommentFrom({ slug }: CreateCommentFormProps) {
  const { data: user } = useSuspenseQuery(sessionQueryOptions);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateComment>({
    mode: 'onChange',
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { slug, body: '' },
  });

  const { mutate, isPending, isError, error } = useCreateCommentMutation({
    mutationKey: [slug],
    onSuccess: () => {
      setValue('body', '');
    },
  });

  const mutationErrors = getErrorMessage(error);
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (createComment: CreateComment) => {
    mutate(createComment);
  };

  return (
    <>
      {isError && (
        <ul className="error-message">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <form className="card comment-form" onSubmit={handleSubmit(onValid)}>
        <div className="card-block">
          <fieldset>
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
              disabled={isPending}
              data-test="comment-input"
              {...register('body')}
            />
            <ErrorMessage errors={errors} name="body" as="div" role="alert" />
          </fieldset>
          <div className="card-footer">
            <img src={user.image || ''} alt={user.username} className="comment-author-img" />
            <button type="submit" className="btn btn-sm btn-primary" disabled={!canSubmit} data-test="comment-submit">
              Post Comment
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
