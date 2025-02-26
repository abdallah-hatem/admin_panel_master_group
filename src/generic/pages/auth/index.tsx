import type { schemeType } from '@/generic/components/core/form';
import type { LoginParams } from '@/generic/interface/user/login';
import type { FC } from 'react';

import './index.less';

import { Form, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LogoImg from '@/assets/logo/logo_prim.png';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import { loginAsync } from '@/generic/stores/user.action';
import { formatSearch } from '@/generic/utils/formatSearch';
import { useLocale } from '@/locales';

interface Props {
  type: 'login' | 'register';
}

const AuthForm: FC<Props> = ({ type = 'login' }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const [form] = Form.useForm();

  const onFinished = async (form: LoginParams) => {
    // @ts-ignore
    const res = dispatch(await loginAsync(form));

    if (!!(await res)) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };

      console.log(from);

      // if (verifyEmailToken) {
      //   navigate('/complete-registeration');
      // } else {
      //   navigate(from);
      // }

      navigate(from);

      //TODO for userNavPermissions detection at helpers/genral.ts (think of another way to handle)
      setTimeout(() => window.location.reload(), 10);
    }
  };

  const getFieldRules = (id: string, messageId: string) => [
    {
      required: true,
      // @ts-ignore
      message: formatMessage({ id: messageId }),
    },
  ];

  const data: schemeType[] = [
    {
      name: 'username',
      rules: getFieldRules('username', 'gloabal.tips.enterUsernameMessage'),
      type: 'input',
      required: true,
      innerProps: { placeholder: formatMessage({ id: 'gloabal.tips.username' }) },
    },
    {
      name: 'password',
      rules: getFieldRules('password', 'gloabal.tips.enterPasswordMessage'),
      type: 'input',
      required: true,
      innerProps: { placeholder: formatMessage({ id: 'gloabal.tips.password' }), type: 'password' },
    },
    // {
    //   name: 'remember',
    //   type: 'switch',
    //   label: 'remember me',
    // },
  ];

  return (
    <div className="bg-[#f0f2f5] flex">
      <CardComp>
        <img src={LogoImg} alt="" className="w-[70%] mx-auto" />

        <Typography.Text className="text-3xl mx-auto my-5 font-bold">
          {type === 'register' ? 'Register' : 'Login'}
        </Typography.Text>

        <MyForm
          onFinish={onFinished}
          showSubmit
          submitStyleTw="w-full"
          options={data}
          form={form}
          layout="horizontal"
          className="w-full"
        />

        <Link to={type === 'login' ? '/register' : '/login'} className="text-[#1890ff] mb-5 underline w-fit">
          {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
        </Link>

        {/* <p
          className="text-[#1890ff] mb-5 cursor-pointer"
          onClick={() =>
            showModal(
              <MyForm
                options={recoverPassFormData}
                onFinish={handleChangePassword}
                showSubmit
                submitText="send recovery email"
                submitStyleTw="float-right"
              />,
              500,
            )
          }
        >
          Forgot password?
        </p> */}
      </CardComp>
    </div>
  );
};

export default AuthForm;
