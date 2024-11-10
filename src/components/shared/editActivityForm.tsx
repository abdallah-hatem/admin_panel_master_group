import { Form, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { UPDATE_ACTIVITY_SCHEDULES } from '@/api/packages';
import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';
import MyformItem from '@/generic/components/core/form-item';
import { useLocale } from '@/locales';

import ActivityOption from './activityOption';
import useFunctions from './activityOption/functions';
import SchedulePricesComp from './schedulePricesComp';
import SchedulePricesForm from './schedulePricesForm';

interface Props {
  onSubmit?: (value: any) => void;
  data?: any;
  updateData?: () => void;
}

export default function EditActivityForm({ data, updateData }: Props) {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [prices, setPrices] = useState<any[]>([]);

  console.log(data);

  const { id } = data && data;

  const { formatMessage } = useLocale();

  useEffect(() => {
    form.setFieldsValue({ update_future_schedules: false });
  }, []);

  useEffect(() => {
    // form.setFieldsValue(data);
    form.setFieldsValue({
      title: data?.title,
      description: data?.description,
      date: dayjs(data?.date),
      end_date: dayjs(data?.end_date),
      total_participants: data?.total_participants,
    });
  }, [data]);

  const onFinish = async (schedulePricesData: any) => {
    console.log(schedulePricesData);

    const data = await form.validateFields();

    console.log(data);

    const val = {
      schedule_prices: schedulePricesData?.schedule_prices,
      ...data,
    };

    delete val.total_participants;

    console.log(val);

    schedulePricesData &&
      data &&
      UPDATE_ACTIVITY_SCHEDULES(id, val).then((res: any) => {
        console.log(res);

        if (res?.status === false) return message.error(res.result.message);

        message.success('Activity updated successfully');

        updateData?.();
      });
  };

  return (
    <div className="mt-10 pr-5 !max-h-[500px] overflow-y-scroll">
      <MyForm<any> form={form} layout="vertical" className="">
        <MyformItem label={formatMessage({ id: 'calendar.form.title' })} name="title" type="input" />
        <MyformItem label={formatMessage({ id: 'calendar.form.discription' })} name="description" type="textarea" />

        <div className="flex space-x-10 items-center">
          <MyformItem
            label={formatMessage({ id: 'calendar.form.start_date' })}
            name="date"
            type="date-picker"
            innerProps={{ showTime: true }}
          />
          <MyformItem
            label={formatMessage({ id: 'calendar.form.end_date' })}
            name="end_date"
            type="date-picker"
            innerProps={{ showTime: true }}
          />

          <MyformItem
            label={formatMessage({ id: 'calendar.form.update_future_schedules' })}
            name="update_future_schedules"
            type="switch"
            innerProps={{}}
          />
        </div>

        <MyformItem
          label={formatMessage({ id: 'calendar.form.total_participants' })}
          name="total_participants"
          type="input-number"
          innerProps={{ disabled: true }}
        />
      </MyForm>

      {/*<SchedulePricesForm formRef={form2} activityData={data} showSubmit={false} onSubmit={onFinish} />*/}

      <ActivityOption
        onSubmit={onFinish}
        optionData={{ ...data, ...data.activity_option }}
        cardStyleTw="border-2 border-gray-500"
        removeDelete
      />

      {/* <MyButton
        type="primary"
        className="my-2 mr-5 w-full"
        onClick={() => {
          form.submit();
          form2.submit();
        }}
      >
        {formatMessage({ id: 'general.submit' })}
      </MyButton> */}
    </div>
  );
}
