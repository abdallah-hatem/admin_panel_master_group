import type { AgesDto } from '@/interface/ages';

import { Form, message } from 'antd';
import { log } from 'console';
import { useEffect, useState } from 'react';

import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';

interface Props {
  setPrices?: (val: any) => void;
  setAction?: (val: any) => void;
}

export default function AddPrices({ setPrices, setAction }: Props) {
  const [form] = Form.useForm();

  // const [ages, setAges] = useState<AgesDto[]>([]);

  const onFinish = (value: any) => {
    const val = {
      ...value,
      // client_type: getClientById(value.clients_age_ranges_id)?.client_type,
    };

    console.log(val);

    setPrices && setPrices((prev: any) => [...prev, val]);
    setAction && setAction((prev: any) => !prev);
    form.resetFields();

    // ADD_AGE(value).then(() => {
    //   message.success('Added successfully');
    //   form.resetFields();

    // });
  };

  return (
    <MyForm<any> onFinish={onFinish} form={form} layout="vertical">
      <MyForm.Item
        label="Client type"
        required
        name="clients_age_ranges_id"
        type="select"
        // options={ages?.map(item => ({ label: item.client_type, value: item.id }))}
      />

      <MyForm.Item label="Minimum participants" required name="minimum_participants" type="input-number" />
      <MyForm.Item label="Maximum participants" required name="maximum_participants" type="input-number" />

      <MyForm.Item label="Price" required name="price" type="input-number" />

      <MyForm.Item>
        <MyButton type="primary" htmlType="submit" className="w-full">
          Submit
        </MyButton>
      </MyForm.Item>
    </MyForm>
  );
}
