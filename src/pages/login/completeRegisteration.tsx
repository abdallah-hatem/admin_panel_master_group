import { Button, Form, message, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { COMPLETE_REGISTRATION, GET_USER_BY_TOKEN } from '@/generic/api/user.api';
import CardComp from '@/generic/components/basic/cardComp';
import useFetch from '@/generic/hooks/useFetch';

import useSteps from './forms/steps';

export default function CompleteRegisteration() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [userDataState, setUserDataState] = useState({});
  const [companyDataState, setCompanyDataState] = useState({});
  const [paymentDataState, setPaymentDataState] = useState({});
  const [billingDataState, setBillingDataState] = useState({});
  const { Step } = Steps;

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  console.log(token);

  const { data: userDetails } = useFetch<any>({
    GET: token ? GET_USER_BY_TOKEN : undefined,
    params: { token },
  });

  console.log(userDetails);

  useEffect(() => {
    userDetails &&
      form.setFieldsValue({
        first_name: userDetails?.first_name,
        last_name: userDetails?.last_name,
        email: userDetails?.email,
      });
  }, [userDetails]);

  const { steps, next, prev } = useSteps({
    formRef: form,
    companyDataState,
    userDataState,
    paymentDataState,
    billingDataState,
    current,
    setCurrent,
    setBillingDataState,
    setPaymentDataState,
    setCompanyDataState,
    setUserDataState,
  });

  async function onFinish() {
    const vals = await form.validateFields();

    setBillingDataState(vals);

    const allData = {
      user: userDataState,
      company: companyDataState,
      payment_method: paymentDataState,
      billing_data: vals,
    };

    const val = { ...allData, token };

    console.log(val);

    COMPLETE_REGISTRATION(val).then((res: any) => {
      if (!res?.id) return;
      message.success('Registered successfully');

      navigate('/login');
    });
  }

  return (
    <div>
      <h1 className="text-3xl text-center mt-9 mb-14">Complete Registeration</h1>
      <CardComp styleTw="w-[90%] mb-9">
        <div className="">
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

          {current === steps.length - 1 && (
            <Button type="primary" className="float-right" onClick={onFinish}>
              Submit
            </Button>
          )}
        </div>
      </CardComp>
    </div>
  );
}
