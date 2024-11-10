import type { schemeType } from '@/generic/components/core/form';

const useAddForm = () => {
  const data: schemeType = [
    { label: 'Name', name: 'name', type: 'input', required: true },
    { label: 'Description', name: 'description', type: 'textarea', innerProps: { className: 'min-h-[100px]' } },
  ];

  return data;
};

export default useAddForm;
