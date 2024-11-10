import type { schemeType } from '@/generic/components/core/form';
import type { CollapseProps } from 'antd';

import { Collapse, Form, message } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { GET_COMPANY_USERS_BY_ID } from '@/api/companyUsers';
import { GET_USERS_BY_ID, UPDATE_USER } from '@/api/users';
import { ASK_RECOVER_PASSWORD } from '@/generic/api/user.api';
import MyButton from '@/generic/components/basic/button';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import useFetch from '@/generic/hooks/useFetch';

import ChangePassword from './changePassword';

export default function ProfilePage() {
  const [form] = Form.useForm();
  const { userProfile } = useSelector((state: any) => state.user);

  console.log(userProfile);
  console.log(userProfile?.id);

  const { data: companyData } = useFetch({ GET: GET_USERS_BY_ID, params: { id: userProfile?.id } });

  useEffect(() => {
    if (companyData) form.setFieldsValue(companyData);
  }, [companyData]);

  const onFinish = (value: any) => {
    console.log(value);
    UPDATE_USER(userProfile.id, value).then(res => {
      if (!res?.result) return;

      message.success('Updated successfully');
    });
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Change Password',
      children: <ChangePassword />,
    },
    // {
    //   key: '2',
    //   label: 'Update company',
    //   children: <UpdateCompany data={companyData} />,
    // },
  ];

  const data: schemeType[] = [
    [
      { label: 'First Name', name: 'first_name', type: 'input', required: false },
      { label: 'Last Name', name: 'last_name', type: 'input', required: false },
      { label: 'Email', name: 'email', type: 'input', required: false },
    ],
    // { label: 'Birthday', name: 'birthday', type: 'date-picker', required: false },
    // { label: 'Zip code', name: 'zip_code', type: 'input', required: false },
    // { label: 'VAT Number', name: 'vat_number', type: 'input', required: false },
    { children: <Collapse items={items} /> },
  ];

  function handleChangePassword() {
    ASK_RECOVER_PASSWORD({ email: userProfile?.email }).then((res: any) => {
      if (res?.includes('Password recovery email sent')) message.success('Recovery email sent');
    });
  }

  return (
    <div>
      <h1 className="text-5xl mb-9 text-center">Profile</h1>
      <CardComp styleTw="w-[90%]">
        <MyForm showSubmit submitText="Save Changes" onFinish={onFinish} options={data} form={form} layout="vertical" />

        {/*  <MyButton type="primary" className="w-fit float-right" onClick={handleChangePassword}>
          Change Password
        </MyButton>*/}
      </CardComp>
    </div>
  );
}
