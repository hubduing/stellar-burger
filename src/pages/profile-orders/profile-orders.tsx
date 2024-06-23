import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  selectIsLoading,
  selectOrders
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders.length === 0 && !isLoading) {
      dispatch(fetchOrders());
    }
  }, [dispatch]);
  console.log(isLoading);

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
