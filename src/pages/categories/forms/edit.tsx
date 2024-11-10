import type { schemeType } from '@/generic/components/core/form';

import { DELETE_FILES_CATEGORY } from '@/api/categories';
import UploadComp from '@/generic/components/basic/uploadComp';

interface Props {
  categoryData: any;
  getData: () => void;
}

export const useEditFormData = ({ categoryData, getData }: Props) => {
  const data: schemeType[] = [
    { label: 'Category name', name: 'name', type: 'input', required: true },
    {
      label: 'Images',
      name: 'upload_files',
      children: (
        <UploadComp
          defaultFileList={categoryData?.files}
          api={`categories/${categoryData?.id}/files`}
          mainId={categoryData?.id}
          reFetch={() => getData()}
          deleteApi={DELETE_FILES_CATEGORY}
          onRemove={(e: any) => {
            console.log(e, 'removed');
            getData();
          }}
        />
      ),
    },
  ];

  return data;
};
