import { IoTrash } from 'react-icons/io5';
import { useDeleteCommentMutation } from './delete-comment.mutation';

interface DeleteCommentButtonProps {
  slug: string;
  commentId: string;
}

export function DeleteCommentButton({ slug, commentId }: DeleteCommentButtonProps) {
  const { mutate } = useDeleteCommentMutation({ mutationKey: [`${commentId} ${slug}`] });

  const handleClick = () => {
    mutate({ slug, commentId });
  };

  return (
    <button
      type="button"
      className="mod-options"
      style={{ border: 0, backgroundColor: 'transparent' }}
      onClick={handleClick}
      data-test="comment-delete-button"
    >
      <span>
        <IoTrash size={14} />
      </span>
    </button>
  );
}
