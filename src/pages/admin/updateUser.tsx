import { Form, message } from 'antd';
import React, { useEffect } from 'react';

import { UPDATE_USER } from '@/api/users';
import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';
import MyFormItem from '@/generic/components/core/form-item';

interface Props {
  setAction: (data?: any) => void;
  triggerModalUpdate?: () => void;
  currentUser: any | null;
  roles: any[];
}

export default function UpdateUser({ setAction, currentUser, roles }: Props) {
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    if (currentUser) {
      formUpdate.setFieldsValue({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        username: currentUser.username,
        email: currentUser.email,
        role_ids: currentUser.role_ids,
      });
    }
  }, [currentUser]);

  const onFinishUpdate = (value: any) => {
    UPDATE_USER(currentUser?.id, value).then(() => {
      message.success('Added successfully');
      setAction((prev: any) => !prev);
    });
  };

  return (
    <MyForm<any>
      onFinish={onFinishUpdate}
      layout="horizontal"
      labelCol={{ span: 5 }}
      form={formUpdate}
      labelAlign="left"
    >
      <MyFormItem label="First name" required name="first_name" type="input" />
      <MyFormItem label="Surname" required name="last_name" type="input" />
      <MyFormItem label="User name" required name="username" type="input" />
      <MyFormItem label="Email" required name="email" type="input" />

      <MyFormItem
        label="Roles"
        required
        name="role_ids"
        type="select"
        options={roles?.map(item => ({ label: item.name, value: item.id }))}
        innerProps={{ mode: 'multiple' }}
      />

      <MyFormItem>
        <MyButton type="primary" htmlType="submit" style={{ float: 'right' }}>
          Submit
        </MyButton>
      </MyFormItem>
    </MyForm>
  );
}
