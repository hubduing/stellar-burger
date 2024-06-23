import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectIsLoading
} from '../../slices/burgerSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeeds);
  const loading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, []);

  return loading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
