import type { FormLayout } from 'antd/es/form/Form';

import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';

import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';

interface Props {
  createdActivityId?: string;
  layout?: FormLayout;
  labelCol?: any;
}

export default function EditRecurrence({ createdActivityId, layout = 'horizontal', labelCol }: Props) {
  const [form] = Form.useForm();

  const router = useNavigate();

  function onFinish(data: any) {
    console.log(data);

    const val = {
      ...data,
      activity_id: createdActivityId,
    };

    console.log(val);

    // ADD_RECURRENCE(val).then((res: any) => {
    //   if (res?.sucess) return message.error(res.result.message);

    //   message.success('Recurrence created successfully');

    //   router('/activities');
    // });
  }

  return (
    <div className="mb-10">
      <MyForm<any> onFinish={onFinish} form={form} layout={layout} labelCol={labelCol ?? { span: 2 }} labelAlign="left">
        {/* <MyForm.Item
          label="Frequency"
          required
          name="frequency"
          type="select"
          options={frequncies?.map(el => ({ label: el.label, value: el.value }))}
        />
        <MyForm.Item label="Interval" required name="interval" type="input" innerProps={{ type: 'number' }} /> */}

        <div className="flex justify-between">
          <MyForm.Item
            label="Start date"
            name="dtstart"
            type="date-picker"
            className="flex-1"
            required
            labelCol={labelCol ?? { span: 100 }}
            innerProps={{
              // format: 'YYYY-MM-DD',
              style: { width: '80%' },
            }}
          />

          <MyForm.Item
            label="End date"
            name="dtend"
            type="date-picker"
            className="flex-1"
            labelCol={labelCol ?? { span: 100 }}
            required
            innerProps={{
              // format: 'YYYY-MM-DD',
              style: { width: '80%' },
            }}
          />

          {/* <MyForm.Item
            label="Until"
            name="until"
            type="date-picker"
            className="flex-1"
            required
            labelCol={labelCol ?? { span: 100 }}
            innerProps={{
              // format: 'YYYY-MM-DD',
              style: { width: '80%' },
            }}
          /> */}
        </div>

        <MyForm.Item>
          <MyButton className="mt-10 float-right" type="primary" htmlType="submit">
            Submit
          </MyButton>
        </MyForm.Item>
      </MyForm>
    </div>
  );
}

const frequncies = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];
