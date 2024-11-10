import type { schemeType } from '@/generic/components/core/form';

import { Form } from 'antd';
import { useSelector } from 'react-redux';

import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { userProfile } = useSelector((state: any) => state.user);

  console.log(userProfile);

  const onFinish = (value: any) => {
    console.log(value);
  };

  const data: schemeType[] = [
    [
      { label: 'First Name', name: 'first_name', type: 'input', required: false },
      { label: 'Last Name', name: 'last_name', type: 'input', required: false },
      { label: 'Email', name: 'email', type: 'input', required: false },
    ],
    // { children: <Collapse items={items} /> },
  ];

  return (
    <div>
      <h1 className="text-5xl mb-9 text-center">Profile</h1>
      <CardComp styleTw="w-[90%]">
        <MyForm showSubmit submitText="Save Changes" onFinish={onFinish} options={data} form={form} layout="vertical" />
      </CardComp>
    </div>
  );
}
