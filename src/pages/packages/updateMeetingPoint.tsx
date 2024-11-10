import type { schemeType } from '@/generic/components/core/form';

import { useEffect } from 'react';

import MyButton from '@/generic/components/basic/button';
import MyForm from '@/generic/components/core/form';

interface Props {
  triggerModal?: () => void;
  data: any;
  markers?: any;
  setMarkers?: (data: any) => void;
}

export default function UpdateMeetingPoint({ triggerModal, data, setMarkers, markers }: Props) {
  const [form] = MyForm.useForm();

  const onFinish = (value: any) => {
    const filteredMarkers = markers?.map((el: any) => {
      if (`${el?.lat}-${el?.lng}` === `${data?.lat}-${data?.lng}`) {
        return (el = value);
      } else {
        return el;
      }
    });

    setMarkers && setMarkers(filteredMarkers);
    triggerModal && triggerModal();
  };

  useEffect(() => {
    form.setFieldValue('name', data?.name);
    form.setFieldValue('lat', data?.lat);
    form.setFieldValue('lng', data?.lng);
  }, [data]);

  const formData: schemeType[] = [
    { label: 'Name', name: 'name', type: 'input', required: true },
    [
      {
        label: 'Latitude',
        name: 'lat',
        type: 'input',
        required: true,
        innerProps: { disabled: true },
        hidden: true,
      },
      {
        label: 'Longitude',
        name: 'lng',
        type: 'input',
        required: true,
        innerProps: { disabled: true },
        hidden: true,
      },
    ],
  ];

  return <MyForm options={formData} layout="vertical" form={form} onFinish={onFinish} showSubmit />;
}
