import type { schemeType } from '@/generic/components/core/form';

import { Form, message } from 'antd';

import { ADD_ACTIVITY_SCHEDULE_ITEM } from '@/api/packageItems';
import MyForm from '@/generic/components/core/form';
import { useLocale } from '@/locales';

interface Props {
  onSuccess?: () => void;
}

export default function AddPackageItem({ onSuccess }: Props) {
  const [form] = Form.useForm();

  const { formatMessage } = useLocale();

  const onFinish = (value: any) => {
    console.log(value);
    ADD_ACTIVITY_SCHEDULE_ITEM(value).then(() => {
      message.success('Added successfully');
      form.resetFields();
      onSuccess && onSuccess();
    });
  };

  const data: schemeType[] = [
    { label: formatMessage({ id: 'activities.form.package_item_name' }), name: 'title', type: 'input', required: true },
  ];

  return (
    <MyForm
      showSubmit
      submitText={formatMessage({ id: 'general.submit' })}
      onFinish={onFinish}
      options={data}
      form={form}
      layout="vertical"
    />
  );
}
