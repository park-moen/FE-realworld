import type { ReactNode } from 'react';
import { CreateArticleFrom } from '~features/article/create-article/create-article.ui';

export function CreateEditorPage() {
  return (
    <EditorPageWrapper>
      <CreateArticleFrom />
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
