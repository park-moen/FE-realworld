import { IoHeart } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import type { Article } from '~entities/article/article.type';
import { useFavoriteArticleMutation } from './favorite-article.mutation';

interface FavoriteArticleButtonProps {
  article: Article;
}

export function FavoriteArticleBriefButton({ article }: FavoriteArticleButtonProps) {
  const { mutate } = useFavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleFavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" variant="outline" onClick={handleFavorite}>
      <IoHeart size={16} />
      {article.favoritesCount}
    </Button>
  );
}

export function FavoriteArticleExtendedButton({ article }: FavoriteArticleButtonProps) {
  const { mutate } = useFavoriteArticleMutation({ mutationKey: [article.slug] });

  const handleFavorite = () => {
    mutate(article.slug);
  };

  return (
    <Button color="primary" variant="outline" onClick={handleFavorite} data-test="favorite-extended-button">
      <IoHeart size={16} />
      &nbsp;Favorite Article&nbsp;
      <span className="counter">({article.favoritesCount})</span>
    </Button>
  );
}
