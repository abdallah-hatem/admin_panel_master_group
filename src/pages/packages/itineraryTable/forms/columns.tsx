import type { MyPageTableOptions } from '@/generic/components/business/page';

import { useLocale } from '@/locales';

interface Props {}

export const useColumns = ({}: Props) => {
  const { formatMessage } = useLocale();

  const columns: MyPageTableOptions<any> = [
    {
      title: formatMessage({ id: 'activities.form.title' }),
      dataIndex: 'title',
      key: 'id',
    },
    { title: formatMessage({ id: 'general.latitude' }), dataIndex: 'lat', key: 'id', width: 100 },
    { title: formatMessage({ id: 'general.longitude' }), dataIndex: 'lng', key: 'id', width: 100 },
    { title: formatMessage({ id: 'general.transport_type' }), dataIndex: 'transport_type', key: 'id', width: 120 },
    { title: formatMessage({ id: 'general.duration' }), dataIndex: 'duration', key: 'id', width: 100 },
    { title: formatMessage({ id: 'general.duration_unit' }), dataIndex: 'duration_unit', key: 'id', width: 100 },
    {
      title: formatMessage({ id: 'general.day' }),
      dataIndex: 'day_number',
      key: 'id',
      width: 60,
    },
  ];

  return columns;
};
