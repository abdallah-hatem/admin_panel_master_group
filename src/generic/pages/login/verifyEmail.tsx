import { LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { VERIFY_EMAIL } from '@/generic/api/user.api';
import { dispatch } from '@/generic/stores';
import { setVerifyEmailToken } from '@/generic/stores/user.store';

export default function VerifyEmail() {
  const location = useLocation();
  const router = useNavigate();
  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  function verifyEmail() {
    VERIFY_EMAIL({ token })
      .then((res: any) => {
        if (res?.status === false) return setError(true);
        message.success('Email verified successfully!');
        router('/login');
      })
      .catch((err: any) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token) {
      dispatch(setVerifyEmailToken(token));
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-row items-center justify-center h-screen bg-gray-100">
      {Loading ? (
        <LoadingOutlined className="text-5xl" spin />
      ) : error ? (
        <h1 className="text-xl font-semibold text-red-800">Something went wrong. Please try again later.</h1>
      ) : (
        <h1 className="text-xl font-semibold text-green-800">Your email has been verified!</h1>
      )}
    </div>
  );
}
