import type { schemeType } from '@/generic/components/core/form';

import { Form, message } from 'antd';

import { ADD_USER } from '@/api/users';
import MyForm from '@/generic/components/core/form';

interface Props {
  triggerModal: () => void;
  setAction: (data?: any) => void;
  roles: any[];
}

export default function AddUser({ triggerModal, setAction, roles }: Props) {
  const [form] = Form.useForm();

  const onFinish = (value: any) => {
    ADD_USER(value).then(res => {
      if (res.status === false) return;

      message.success('Added successfully');
      form.resetFields();
      setAction((prev: any) => !prev);
      triggerModal();
    });
  };

  const data: schemeType[] = [
    { label: 'First name', name: 'first_name', type: 'input', required: true },
    { label: 'Surname', name: 'last_name', type: 'input', required: true },
    { label: 'User name', name: 'username', type: 'input', required: true },
    { label: 'Email', name: 'email', type: 'input', required: true },
    { label: 'Password', name: 'password', type: 'input', required: true },
    {
      label: 'Roles',
      name: 'role_ids',
      type: 'select',
      required: true,
      options: roles?.map(item => ({ label: item.name, value: item.id })),
      innerProps: { mode: 'multiple' },
    },
  ];

  return <MyForm onFinish={onFinish} showSubmit options={data} labelCol={{ span: 4 }} form={form} labelAlign="left" />;
}
