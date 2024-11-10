import type { schemeType } from '@/generic/components/core/form';

import { Form, message } from 'antd';
import { useSelector } from 'react-redux';

import { CHANGE_PASSWORD } from '@/generic/api/user.api';
import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';

export default function ChangePassword() {
  const [form] = Form.useForm();
  const { userProfile } = useSelector((state: any) => state.user);

  const onFinish = async () => {
    const data = await form.validateFields();

    CHANGE_PASSWORD(userProfile.id, data).then((res: any) => {
      if (res?.message?.startsWith('Password')) return message.success('Password updated successfully');
    });
  };

  const data: schemeType[] = [
    [
      { label: 'Current Password', name: 'old_password', type: 'input', required: true },
      { label: 'New Password', name: 'new_password', type: 'input', required: true },
      // { label: 'Confirm Password', name: 'confirm_password', type: 'input', required: true },
    ],
  ];

  return (
    <>
      <MyForm options={data} form={form} layout="vertical" />
      {/* adding button to prevent submiting th full form */}
      <MyButton children="Change Password" type="primary" onClick={onFinish} />
    </>
  );
}
