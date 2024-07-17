import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders, selectOrders } from '../../slices/orderSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
