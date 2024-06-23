import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsUserLoading, selectUser } from '../../slices/userSlice';
import { getCookie } from '../../utils/cookie';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isLoading = useSelector(selectIsUserLoading);
  const user = useSelector(selectUser);
  const accessToken = getCookie('accessToken');
  const location = useLocation();

  if (isLoading && accessToken) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  // console.log(user, onlyUnAuth);
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};
