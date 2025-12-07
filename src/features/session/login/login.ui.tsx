import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '~shared/lib/utils';
import { pathKey } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { useLoginMutation } from './login.mutation';
import { LoginUserSchema, type LoginUser } from './login.schema';

export default function LoginForm() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <BaseLoginForm />
    </ErrorBoundary>
  );
}

function BaseLoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginUser>({
    mode: 'onTouched',
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending, isError, error } = useLoginMutation({
    onSuccess(session) {
      navigate(pathKey.profile.byUsername(session.username));
    },
  });

  const mutationErrors = getErrorMessage(error);
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (loginUser: LoginUser) => {
    mutate(loginUser);
  };

  return (
    <>
      {isError && (
        <ul className="error-messages" data-test="login-error">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit(onValid)}>
        <fieldset className="form-group" disabled={isPending}>
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
            data-test="login-email"
            {...register('email')}
          />
          <ErrorMessage errors={errors} name="email" as="div" role="alert" />
        </fieldset>

        <fieldset className="form-group" disabled={isPending}>
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            data-test="login-password"
            {...register('password')}
          />
          <ErrorMessage errors={errors} name="password" as="div" role="alert" />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={!canSubmit}
          data-test="login-submit"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
