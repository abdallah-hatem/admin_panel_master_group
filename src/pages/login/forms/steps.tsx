import { useEffect } from 'react';

import GoogleButton from '@/generic/components/basic/googleButton';
import MyForm from '@/generic/components/core/form';

import useAddForm from './add';

interface Props {
  formRef: any;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  userDataState: any;
  companyDataState: any;
  paymentDataState: any;
  billingDataState: any;
  setBillingDataState: React.Dispatch<React.SetStateAction<any>>;
  setPaymentDataState: React.Dispatch<React.SetStateAction<any>>;
  setCompanyDataState: React.Dispatch<React.SetStateAction<any>>;
  setUserDataState: React.Dispatch<React.SetStateAction<any>>;
}

const useSteps = ({
  formRef: form,
  current,
  setCurrent,
  userDataState,
  companyDataState,
  paymentDataState,
  billingDataState,
  setUserDataState,
  setBillingDataState,
  setCompanyDataState,
  setPaymentDataState,
}: Props) => {
  const { billingData, companyData, paymentData, userData } = useAddForm();

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

  return { steps, next, prev };
};

export default useSteps;
