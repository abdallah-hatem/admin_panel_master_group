import type { RcFile } from 'antd/es/upload';

import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Spin, Upload } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { ApiBaseUrl } from '@/generic/api/request';

interface Props {
  api?: string;
  defaultFileList?: any[];
  onRemove?: (data?: any) => void;
  reFetch?: () => void;
  type?: 'add-after-create' | 'add-before-create';
  onFinish?: (data?: any) => void;
  deleteApi?: any;
  mainId?: number | string;
  buttonTitle?: string;
  multiple?: boolean;
  minWidth?: number;
  minHeight?: number;
  allowAnyWidthOrHeight?: boolean;
}

export default function UploadComp({
  api,
  defaultFileList,
  onRemove,
  reFetch,
  type = 'add-after-create',
  onFinish,
  deleteApi,
  mainId,
  buttonTitle = 'Upload',
  multiple = true,
  minWidth = 1280,
  minHeight = 600,
  allowAnyWidthOrHeight = false,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  console.log(files);

  useEffect(() => {
    onFinish?.(files);
  }, [files]);

  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const customRequest = async ({ file, onSuccess, onStart, onError, onProgress }: any) => {
    const formData = new FormData();
    const base64 = await getBase64(file);

    console.log(base64, 'base64');

    formData.append('file', file);

    console.log(file, 'formData');

    const payload = {
      upload_files: [
        {
          uid: file.uid,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          name: file.name,
          size: file.size,
          type: file.type,
          percent: 0,
          originFileObj: { uid: file.uid },
          base64,
        },
      ],
    };

    console.log(payload);

    if (type === 'add-before-create') return setFiles(prev => [...prev, payload.upload_files[0]]);

    setLoading(true);

    axios
      .post(`${ApiBaseUrl}/${api}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('t'),
        },
      })
      .then((response: any) => {
        onSuccess(response);
        message.success('Image uploaded successfully');
        reFetch?.();
      })
      .catch((error: any) => {
        onError(error);
        message.error('Image upload failed');
      })
      .finally(() => setLoading(false));
  };

  async function viewList({ file }: any) {
    const formData = new FormData();
    const base64 = await getBase64(file);

    console.log(base64, 'base64');

    formData.append('file', file);

    console.log(file, 'formData');

    const payload = {
      upload_files: [
        {
          uid: file.uid,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          name: file.name,
          size: file.size,
          type: file.type,
          percent: 0,
          originFileObj: { uid: file.uid },
          base64,
        },
      ],
    };

    console.log(payload);

    if (type === 'add-before-create') return setFiles(prev => [...prev, payload.upload_files[0]]);
  }

  const getDefaultList: any = () => {
    return defaultFileList?.map((el: any) => {
      return {
        uid: el.id,
        name: el.name,
        status: 'done',
        url: el.url,
      };
    });
  };

  const handleRemove = (e: any) => {
    if (deleteApi) {
      return deleteApi(Number(mainId), e?.id).then((res: any) => {
        if (res?.status !== false) {
          onRemove?.(e);

          return message.success('Successfully Deleted file');
        }
      });
    }

    if (type === 'add-before-create') {
      setFiles(prev => prev.filter((el: any) => el.uid !== e.uid));
      onRemove?.(e);
    }
  };

  const beforeUpload = (file: RcFile): Promise<boolean> => {
    return new Promise(resolve => {
      const reader = new FileReader();

      if (!file.type.startsWith('image')) return resolve(true);

      reader.readAsDataURL(file);

      reader.addEventListener('load', event => {
        const _loadedImageUrl = event.target?.result;

        const image = document.createElement('img');

        image.src = _loadedImageUrl as string;

        image.addEventListener('load', () => {
          const { width, height } = image;

          if (allowAnyWidthOrHeight) return resolve(true);

          if (width < minWidth || height < minHeight) {
            message.error(`Image must be at least ${minWidth}x${minHeight}px`);

            return resolve(false);
          }

          const isValidImageType =
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/gif' ||
            file.type === 'image/jpg';

          if (!isValidImageType) {
            message.error('Only image with types jpg, jpeg, png, gif are allowed');
            resolve(false);
          }

          resolve(true);
        });
      });
    });
  };

  return (
    <Upload
      multiple={multiple}
      customRequest={customRequest}
      onChange={({ file }) => viewList({ file })}
      beforeUpload={e => beforeUpload(e)}
      listType="picture"
      defaultFileList={getDefaultList()}
      fileList={defaultFileList}
      onRemove={(e: any) => handleRemove(e)}
      headers={{
        Authorization: 'Bearer ' + localStorage.getItem('t'),
      }}
    >
      <Button icon={<UploadOutlined />}>{buttonTitle}</Button>
      {loading && <Spin className="ml-5" />}
    </Upload>
  );
}

// how to use

// add and api call
{
  /* <UploadComp
defaultFileList={defaultData?.files}
api={`items/${defaultData?.id}/files`}
mainId={defaultData?.id}
reFetch={() => getData?.()}
deleteApi={DELETE_CONCEPT_FILES}
onRemove={() => getData?.()}
/> */
}

// add before api call
{
  /* <UploadComp type="add-before-create" onFinish={files => form?.setFieldValue('upload_files', files)} /> */
}
