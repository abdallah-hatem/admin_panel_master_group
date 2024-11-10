import type { schemeType } from '@/generic/components/core/form';

import UploadComp from '@/generic/components/basic/uploadComp';

interface Props {
  form: any;
}

export const useAddFormData = ({ form }: Props) => {
  const data: schemeType[] = [
    { label: 'Category name', name: 'name', type: 'input', required: true },
    {
      label: 'Images',
      name: 'upload_files',
      children: <UploadComp type="add-before-create" onFinish={e => form.setFieldValue('upload_files', e)} />,
    },
  ];

  return data;
};
