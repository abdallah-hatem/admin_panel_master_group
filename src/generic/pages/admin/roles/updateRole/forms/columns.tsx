import type { MyPageTableOptions } from '@/generic/components/business/page';

const useColumns = () => {
  const columns: MyPageTableOptions<any> = [
    { title: 'Name', dataIndex: 'name', key: 'id' },
    { title: 'No. users', dataIndex: 'n_users', width: 100, key: 'id' },
    { title: 'Creation date', dataIndex: 'inserted_at', key: 'id' },
  ];

  return columns;
};

export default useColumns;
