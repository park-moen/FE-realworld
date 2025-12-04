import { IoAdd } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { useFollowProfileMutation } from './follow-profile.mutation';

export function FollowUserButton({ username }: { username: string }) {
  const { mutate } = useFollowProfileMutation({ mutationKey: [username] });
  const handleClick = () => {
    mutate(username);
  };

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={handleClick}
      data-test="follow-button"
      aria-label={`Follow ${username}`}
    >
      <IoAdd size={16} />
      Follow {username}
    </Button>
  );
}
