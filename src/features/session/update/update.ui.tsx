import { Suspense } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '~shared/lib/utils';
import { pathKey } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { sessionQueryOptions } from '~entities/session/session.api';
import { UpdateUserSchema } from './update.contracts';
import { useUpdateUserMutation } from './update.mutation';
import UpdateSessionFormSkeleton from './update.skeleton';
import type { UpdateUser } from './update.type';

export function UpdateSessionForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<UpdateSessionFormSkeleton />}>
        <BaseUpdateSessionForm />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseUpdateSessionForm() {
  const navigate = useNavigate();
  const {
    data: { username, email, bio = '', image = '' },
  } = useSuspenseQuery(sessionQueryOptions);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateUser>({
    mode: 'onTouched',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { username, email, bio, image, password: '' },
  });

  const { mutate, isPending, isError, error } = useUpdateUserMutation({
    onSuccess(session) {
      navigate(pathKey.profile.byUsername(session.username), { replace: true });
    },
  });

  const mutationErrors = getErrorMessage(error);
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (updateUser: UpdateUser) => {
    mutate(updateUser);
  };

  return (
    <>
      {isError && (
        <ul className="error-messages">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onValid)}>
        <fieldset>
          <fieldset className="form-group" disabled={isPending}>
            <input type="text" className="form-control" placeholder="URL of profile picture" {...register('image')} />
            <ErrorMessage errors={errors} name="image" />
          </fieldset>

          <fieldset className="form-group" disabled={isPending}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Your Name"
              {...register('username')}
            />
            <ErrorMessage errors={errors} name="username" />
          </fieldset>

          <fieldset className="form-group" disabled={isPending}>
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              {...register('bio')}
            />
            <ErrorMessage errors={errors} name="bio" />
          </fieldset>

          <fieldset className="form-group" disabled={isPending}>
            <input type="text" className="form-control form-control-lg" placeholder="Email" {...register('email')} />
            <ErrorMessage errors={errors} name="email" />
          </fieldset>

          <fieldset className="form-group" disabled={isPending}>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
              {...register('password')}
            />
            <ErrorMessage errors={errors} name="password" />
          </fieldset>

          <button type="submit" className="btn btn-lg btn-primary pull-xs-right" disabled={!canSubmit}>
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
}
