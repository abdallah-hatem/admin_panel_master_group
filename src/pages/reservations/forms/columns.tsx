import type { MyPageTableOptions } from '@/generic/components/business/page';

import { useLocale } from '@/locales';

interface Props {}

export const useColumns = ({}: Props) => {
  const { formatMessage } = useLocale();

  const columns: MyPageTableOptions<any> = [
    { title: formatMessage({ id: 'reservation.id' }), dataIndex: 'id', key: 'id' },

    { title: formatMessage({ id: 'reservation.status' }), dataIndex: 'status', key: 'id' },
    { title: formatMessage({ id: 'reservation.total_price' }), dataIndex: 'total_price', key: 'id' },

    { title: formatMessage({ id: 'reservation.reservation_date' }), dataIndex: 'reservation_date', key: 'id' },
    {
      title: formatMessage({ id: 'reservation.activity_title' }),
      dataIndex: 'activity_schedule',
      key: 'id',
      render: (data: any) => data?.title,
    },
    // {
    //   title: formatMessage({ id: 'reservation.activity_schedule_id' }),
    //   dataIndex: 'activity_schedule_id',
    //   key: 'id',
    //   width: 100,
    // },
  ];

  return columns;
};
