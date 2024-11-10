import type { schemeType } from '@/generic/components/core/form';

import { LoadingOutlined } from '@ant-design/icons';
import { message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RECOVER_PASSWORD_BY_TOKEN } from '@/generic/api/user.api';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';

export default function RecoverPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  console.log(token);

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  const onFinish = (data: any) => {
    if (!token) return;

    RECOVER_PASSWORD_BY_TOKEN({ token, password: data.password })
      .then((res: any) => {
        if (res?.status === false) return setError(true);
        message.success('Password changed successfully!');

        navigate('/login');
      })
      .catch((err: any) => setError(err))
      .finally(() => setLoading(false));
  };

  const data: schemeType[] = [[{ label: 'New Password', name: 'password', type: 'input', required: true }]];

  return (
    <div className="flex flex-row items-center justify-center h-screen bg-gray-100">
      <CardComp>
        {Loading ? (
          <LoadingOutlined className="text-5xl" spin />
        ) : error ? (
          <h1 className="text-xl font-semibold text-red-800">Something went wrong. Please try again later.</h1>
        ) : (
          <>
            <Typography.Text className="text-3xl mb-9 text-center">Recover Password</Typography.Text>
            <MyForm options={data} onFinish={onFinish} layout="vertical" showSubmit submitStyleTw="float-right" />
          </>
        )}
      </CardComp>
    </div>
  );
}
