import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { useDeleteArticleMutation } from './delete-article.mutation';

export function DeleteArticleButton({ slug }: { slug: string }) {
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteArticleMutation({
    mutationKey: [slug],
    onSuccess() {
      navigate(pathKey.home, { replace: true });
    },
  });

  const handleClick = () => {
    mutate(slug);
  };

  return (
    <button type="button" className="btn btn-outline-danger btn-sm" disabled={isPending} onClick={handleClick}>
      <IoTrash size={16} />
      Delete Article
    </button>
  );
}
