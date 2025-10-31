import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { useRegisterMutation } from './register.mutation';
import { RegisterUserSchema, type RegisterUser } from './register.schema';

export function BaseRegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<RegisterUser>({
    mode: 'onTouched',
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const { mutate, isPending, isError, error } = useRegisterMutation({
    onSuccess(session) {
      navigate(pathKey.profile.byUsername(session.username));
    },
  });

  const mutationErrors = (error?.response?.data || [error?.message]) as string[];
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (registerUser: RegisterUser) => {
    mutate(registerUser);
  };

  return (
    <>
      {isError && (
        <ul className="error-messages" data-test="register-error">
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
            placeholder="Your Name"
            data-test="register-username"
            {...register('username')}
          />
        </fieldset>
        <ErrorMessage errors={errors} name="username" as="div" role="alert" />

        <fieldset className="form-group" disabled={isPending}>
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
            data-test="register-email"
            {...register('email')}
          />
        </fieldset>
        <ErrorMessage errors={errors} name="email" as="div" role="alert" />

        <fieldset className="form-group" disabled={isPending}>
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            data-test="register-password"
            {...register('password')}
          />
        </fieldset>
        <ErrorMessage errors={errors} name="password" as="div" role="alert" />

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={!canSubmit}
          data-test="register-submit"
        >
          Sign up
        </button>
      </form>
    </>
  );
}
