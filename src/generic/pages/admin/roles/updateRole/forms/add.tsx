import type { schemeType } from '@/generic/components/core/form';

interface Props {
  handleBlurName: (data: any) => void;
  handleBlurDesc: (data: any) => void;
}

const useAddForm = ({ handleBlurDesc, handleBlurName }: Props) => {
  const data: schemeType = [
    {
      label: 'Role name',
      name: 'name',
      type: 'input',
      innerProps: { onBlur: (e: any) => handleBlurName(e) },
      required: true,
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      innerProps: { onBlur: (e: any) => handleBlurDesc(e) },
      required: true,
    },
  ];

  return data;
};

export default useAddForm;
