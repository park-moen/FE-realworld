import { IoHeart } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import type { Article } from '~entities/article/article.type';
import { useUnfavoriteArticleMutation } from './unfavorite-article.mutation';

interface UnfavoriteArticleButtonProps {
  article: Article;
}

export function UnfavoriteArticleBriefButton({ article }: UnfavoriteArticleButtonProps) {
  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" onClick={handleUnfavorite}>
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  );
}

export function UnfavoriteArticleExtendedButton({ article }: UnfavoriteArticleButtonProps) {
  const { mutate } = useUnfavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleUnfavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" onClick={handleUnfavorite}>
      <IoHeart size={16} />
      Unfavorite Article
      <span className="counter">{article.favoritesCount}</span>
    </Button>
  );
}
