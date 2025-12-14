import type { ReactNode } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CreateArticleFrom } from '~features/article/create-article/create-article.ui';
import { UpdateArticleForm } from '~features/article/update-article/update-article.ui';
import type { EditorLoaderArgs } from './editor-page.loader';

export function CreateEditorPage() {
  return (
    <EditorPageWrapper>
      <CreateArticleFrom />
    </EditorPageWrapper>
  );
}

export function UpdateEditorPage() {
  const {
    params: { slug },
  } = useLoaderData<EditorLoaderArgs>();

  return (
    <EditorPageWrapper>
      <UpdateArticleForm slug={slug} />
    </EditorPageWrapper>
  );
}

function EditorPageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
