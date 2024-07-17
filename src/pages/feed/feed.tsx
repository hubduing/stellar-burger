import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  fetchFeeds,
  selectOrdersFeeds
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersFeeds);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, []);

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
