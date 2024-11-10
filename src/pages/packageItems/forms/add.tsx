import type { schemeType } from '@/generic/components/core/form';

interface Props {}

export const useAddFormData = ({}: Props) => {
  const data: schemeType[] = [{ label: 'Title', name: 'title', type: 'input', required: true }];

  return data;
};
