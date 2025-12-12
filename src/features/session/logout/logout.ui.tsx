import { useNavigate } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { useLogoutMutation } from './logout.mutation';

export function LogoutButton() {
  const navigate = useNavigate();

  const { mutate } = useLogoutMutation({
    onSuccess() {
      navigate(pathKey.home);
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <button type="button" className="btn btn-outline-danger" onClick={handleClick}>
      Or click here to logout.
    </button>
  );
}
