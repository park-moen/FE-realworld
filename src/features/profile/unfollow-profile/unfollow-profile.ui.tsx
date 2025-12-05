import { IoRemove } from 'react-icons/io5';
import { Button } from '~shared/ui/button/button.ui';
import { useUnfollowProfileMutation } from './unfollow-profile.mutation';

export function UnfollowUserProfile({ username }: { username: string }) {
  const { mutate } = useUnfollowProfileMutation({ mutationKey: [username] });
  const handleClick = () => {
    mutate(username);
  };

  return (
    <Button
      color="secondary"
      variant="outline"
      className="action-btn"
      onClick={handleClick}
      data-test="unfollow-button"
      aria-label={`Unfollow ${username}`}
    >
      <IoRemove size={16} />
      Unfollow {username}
    </Button>
  );
}
