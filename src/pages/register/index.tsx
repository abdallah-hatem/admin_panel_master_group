import type { schemeType } from '@/generic/components/core/form';

import { Button, Form, message, Steps, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ADD_USER_AND_COMPANY } from '@/api/companyUsers';
import LogoImg from '@/assets/logo/logo_prim.png';
import CardComp from '@/generic/components/basic/cardComp';
import GoogleButton from '@/generic/components/basic/googleButton';
import MyForm from '@/generic/components/core/form';

export default function Register() {
  const { Step } = Steps;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const router = useNavigate();
  const [userDataState, setUserDataState] = useState({});
  const [companyDataState, setCompanyDataState] = useState({});
  const [paymentDataState, setPaymentDataState] = useState({});
  const [billingDataState, setBillingDataState] = useState({});

  useEffect(() => {
    switch (current) {
      case 0:
        form.setFieldsValue(userDataState);
        break;
      case 1:
        form.setFieldsValue(companyDataState);
        break;
      case 2:
        form.setFieldsValue(paymentDataState);
        break;
      case 3:
        form.setFieldsValue(billingDataState);
        break;
      default:
        break;
    }
  }, [current]);

  const userData: schemeType[] = [
    [
      {
        label: 'First name',
        name: 'first_name',
        type: 'input',
        required: true,
      },
      {
        label: 'Last name',
        name: 'last_name',
        type: 'input',
        required: true,
      },
    ],
    {
      label: 'Email',
      name: 'email',
      type: 'input',
      required: true,
    },
    {
      label: 'Password',
      name: 'password',
      type: 'input',
      required: true,
      innerProps: {
        type: 'password',
      },
    },
  ];

  const companyData: schemeType[] = [
    {
      label: 'Company name',
      name: 'name',
      type: 'input',
      required: true,
    },
  ];

  const paymentData: schemeType[] = [
    {
      label: 'Payment Method',
      name: '_type',
      type: 'select',
      options: [{ label: 'Bank Transfer', value: 'bank_transfer' }],
      required: true,
    },
    {
      label: 'IBAN',
      name: 'iban',
      type: 'input',
      required: true,
    },
    {
      label: 'SWIFT',
      name: 'swift',
      type: 'input',
      required: true,
    },
    {
      label: 'Beneficiary Name',
      name: 'beneficiary_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank City',
      name: 'bank_city',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank Name',
      name: 'bank_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank Address',
      name: 'bank_address',
      type: 'input',
      required: true,
    },
  ];

  const billingData: schemeType[] = [
    {
      label: 'VAT Number',
      name: 'vat_number',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Address',
      name: 'billing_address',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Name',
      name: 'billing_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Country',
      name: 'billing_country',
      type: 'input',
      required: true,
    },
  ];

  const steps = [
    {
      title: 'User Data',
      content: (
        <>
          <MyForm showSubmit={false} options={userData} form={form} layout="vertical" />{' '}
          <div className="flex justify-center">
            <GoogleButton />
          </div>
        </>
      ),
    },
    {
      title: 'Company Details',
      content: <MyForm showSubmit={false} options={companyData} form={form} layout="vertical" />,
    },
    {
      title: 'Payment Details',
      content: <MyForm showSubmit={false} options={paymentData} form={form} layout="vertical" />,
    },
    {
      title: 'Billing Data',
      content: <MyForm showSubmit={false} options={billingData} form={form} layout="vertical" />,
    },
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();

      switch (current) {
        case 0:
          setUserDataState(values);
          break;
        case 1:
          setCompanyDataState(values);
          break;
        case 2:
          setPaymentDataState(values);
          break;
        case 3:
          setBillingDataState(values);
          break;
        default:
          break;
      }

      setCurrent(current + 1);
      // form.resetFields();
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    form.resetFields();

    switch (current) {
      case 1:
        form.setFieldsValue(userDataState);
        break;
      case 2:
        form.setFieldsValue(companyDataState);
        break;
      case 3:
        form.setFieldsValue(paymentDataState);
        break;
      default:
        break;
    }
  };

  const onFinish = async () => {
    try {
      // steps[current].content.props.options.map(opt => opt.name)
      const values = await form.validateFields();

      setBillingDataState(values);

      const allData = {
        user: userDataState,
        company: companyDataState,
        payment_method: paymentDataState,
        billing_data: values,
      };

      ADD_USER_AND_COMPANY(allData).then((res: any) => {
        if (res?.status === false) return;

        message.success('Verification link sent to your email successfully!');
        router('/login');
      });
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  return (
    <div className="bg-[#f0f2f5] flex">
      {/* <div className="flex flex-col w-[800px] mx-auto bg-white rounded-3xl !p-5 m-5 shadow-md max-h-screen "> */}
      <CardComp styleTw="w-[800px] max-h-[90vh]">
        <img src={LogoImg} alt="" className="w-[70%] mx-auto" />

        <Typography.Text className="text-3xl mx-auto my-5 font-bold">Register</Typography.Text>

        <div className="overflow-y-scroll overflow-x-hidden pr-5">
          <Steps current={current} className="mb-10">
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>

          <div className="steps-content">{steps[current].content}</div>

          <div className="steps-action mb-5">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}

            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                Previous
              </Button>
            )}
          </div>

          <Link to="/login" className="text-[#1890ff] underline">
            Login
          </Link>

          {current === steps.length - 1 && (
            <Button type="primary" className="float-right" onClick={onFinish}>
              Submit
            </Button>
          )}
        </div>
      </CardComp>
      {/* </div> */}
    </div>
  );
}
