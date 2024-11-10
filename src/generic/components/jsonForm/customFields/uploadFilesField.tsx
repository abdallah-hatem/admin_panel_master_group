import type { RootState } from '@/generic/stores';
import type { FieldProps } from '@rjsf/utils';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ApiBaseUrl } from '@/generic/api/request';

import UploadComp from '../../basic/uploadComp';

interface Props extends FieldProps {}

export default function UploadFilesField({ onChange, uiSchema, formData, schema }: Props) {
  const { currentRecored } = useSelector((state: RootState) => state.form);

  const [data, setData] = useState<any>(null);

  console.log(uiSchema);
  console.log(schema);
  const title = schema?.[Object.keys(schema)[0]];

  console.log(title);

  console.log(currentRecored);

  const apiRoute = uiSchema?.['ui:apiRoute'];

  const getData = async () => {
    const res = await axios.get(ApiBaseUrl + `${apiRoute}/${currentRecored?.id}`);

    setData(res?.data);
  };

  useEffect(() => {
    currentRecored && getData();
  }, [currentRecored]);

  if (apiRoute && data) {
    const DELETE_FILES = async (id: number, fileId: number) => {
      axios.delete(ApiBaseUrl + `${apiRoute}/${id}/files/${fileId}`).then((res: any) => {
        console.log(res);
      });
    };

    return (
      <div className="mt-[6px] ">
        <label>{title.title}</label>
        <UploadComp
          defaultFileList={data?.files}
          api={`${apiRoute}/${data?.id}/files`}
          mainId={data?.id}
          reFetch={() => getData()}
          deleteApi={DELETE_FILES}
          onRemove={(e: any) => {
            console.log(e, 'removed');
            getData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-[6px] flex flex-col space-y-5">
      <label>{title.title}</label>
      <UploadComp type="add-before-create" onFinish={e => onChange(e)} />
    </div>
  );
}
