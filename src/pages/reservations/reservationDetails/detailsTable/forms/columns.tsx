import type { MyPageTableOptions } from '@/generic/components/business/page';

const useColumns = () => {
  const columns: MyPageTableOptions<any> = [
    { title: 'Number of people', dataIndex: 'number_of_people', key: 'id' },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'id',
      render: (text: any) => `${text ?? 'Null'}`,
    },
    {
      title: 'Client type',
      dataIndex: 'client_type',
      key: 'id',
      render: (text: any) => `${text ?? 'Null'}`,
    },
  ];

  return columns;
};

export default useColumns;
