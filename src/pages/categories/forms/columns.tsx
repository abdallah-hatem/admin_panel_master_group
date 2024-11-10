import type { MyPageTableOptions } from '@/generic/components/business/page';

const useColumns = () => {
  const columns: MyPageTableOptions<any> = [{ title: 'Name', dataIndex: 'name', key: 'id' }];

  return columns;
};

export default useColumns;
