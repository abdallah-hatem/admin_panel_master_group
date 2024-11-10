import type { schemeType } from '@/generic/components/core/form';

import { Form } from 'antd';
import { useEffect } from 'react';

import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';

interface Props {
  data: any;
}

export default function UpdateCompany({ data: defaultData }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    defaultData && form.setFieldsValue(defaultData?.company);
  }, []);

  const onFinish = async () => {
    const isValid = await form.validateFields();

    console.log(isValid, 'isValid');
  };

  const data: schemeType[] = [{ label: 'Name', name: 'name', type: 'input', required: true }];

  return (
    <>
      <MyForm options={data} form={form} layout="vertical" />

      {/* adding button to prevent submiting th full form */}
      <MyButton children="Update" type="primary" onClick={onFinish} />
    </>
  );
}
