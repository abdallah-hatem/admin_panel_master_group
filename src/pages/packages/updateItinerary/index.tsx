import { useEffect } from 'react';

import MyForm from '@/generic/components/core/form';

import { useAddForm } from './forms/add';

interface Props {
  triggerModal?: () => void;
  data: any;
  markers?: any;
  setMarkers?: (data: any) => void;
}

export default function UpdateItinerary({ triggerModal, data, setMarkers, markers }: Props) {
  const [form] = MyForm.useForm();

  const onFinish = (value: any) => {
    const filteredMarkers = markers?.map((el: any) => {
      if (`${el?.lat}-${el?.lng}` === `${data?.lat}-${data?.lng}`) {
        return (el = value);
      } else {
        return el;
      }
    });

    console.log(filteredMarkers);

    console.log(value);

    setMarkers && setMarkers(filteredMarkers);
    triggerModal && triggerModal();
  };

  useEffect(() => {
    // form.setFieldsValue(data);
    form.setFieldValue('lat', data?.lat);
    form.setFieldValue('lng', data?.lng);
    form.setFieldValue('order', data?.order);
    form.setFieldValue('transport_type', data?.transport_type);
    form.setFieldValue('title', data?.title);
    form.setFieldValue('duration', data?.duration);
    form.setFieldValue('duration_unit', data?.duration_unit);
    form.setFieldValue('day_number', data?.day_number);
  }, [data]);

  const formData = useAddForm({ formRef: form });

  return (
    <MyForm<any> onFinish={onFinish} options={formData} form={form} layout="vertical" labelAlign="left" showSubmit />
  );
}
