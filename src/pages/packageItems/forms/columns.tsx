import type { MyPageTableOptions } from '@/generic/components/business/page';

interface Props {}

export const useColumns = ({}: Props) => {
  const columns: MyPageTableOptions<any> = [{ title: 'Title', dataIndex: 'title', key: 'id' }];

  return columns;
};
