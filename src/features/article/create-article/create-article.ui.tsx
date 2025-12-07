import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '~shared/lib/utils';
import { pathKey } from '~shared/router';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { CreateArticleSchema } from './create-article.contracts';
import { useCreateArticleMutation } from './create-article.mutation';
import type { CreateArticle } from './create-article.type';

export function CreateArticleFrom() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <BaseCreateArticleForm />
    </ErrorBoundary>
  );
}

function BaseCreateArticleForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateArticle>({
    mode: 'onTouched',
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: { title: '', description: '', body: '', tagList: '' },
  });

  const { mutate, isPending, isError, error } = useCreateArticleMutation({
    onSuccess: ({ slug }) => {
      navigate(pathKey.article.bySlug(slug));
    },
  });

  const mutationErrors = getErrorMessage(error);
  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  const onValid = (createArticle: CreateArticle) => {
    mutate(createArticle);
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      {isError && (
        <ul className="error-messages">
          {mutationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Article Title"
          disabled={isPending}
          {...register('title')}
        />
        <ErrorMessage errors={errors} name="title" as="div" role="alert" />
      </fieldset>

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control "
          placeholder="What's this article about?"
          disabled={isPending}
          {...register('description')}
        />
        <ErrorMessage errors={errors} name="description" as="div" role="alert" />
      </fieldset>

      <fieldset className="form-group">
        <textarea
          className="form-control "
          rows={8}
          placeholder="Write your article (in markdown)"
          disabled={isPending}
          {...register('body')}
        />
        <ErrorMessage errors={errors} name="body" as="div" role="alert" />
      </fieldset>

      <fieldset className="form-group">
        <input
          type="text"
          className="form-control "
          placeholder="Enter tags"
          disabled={isPending}
          {...register('tagList')}
        />
        <ErrorMessage errors={errors} name="tagList" as="div" role="alert" />
      </fieldset>

      <button type="submit" className="btn btn-lg pull-xs-right btn-primary" disabled={!canSubmit}>
        Publish Article
      </button>
    </form>
  );
}
