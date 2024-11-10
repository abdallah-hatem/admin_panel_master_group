import { Button } from 'antd';
import { useEffect, useState } from 'react';

import MyFormItem from '@/generic/components/core/form-item';

interface Props {
  fields?: any;
  formRef?: any;
}

export default function LanguagesFormList({ fields, formRef }: Props) {
  const [showField, setShowField] = useState(false);

  console.log(fields);

  const toggleField = () => setShowField(!showField);

  const data = formRef.getFieldValue(['schedule_prices']);

  console.log(data);

  console.log(formRef.getFieldsValue());

  // useEffect(() => {
  //   if (!showField) {
  //     formRef.setFieldsValue({
  //       languages: [],
  //     });
  //   }
  // }, [showField]);

  return (
    <>
      <Button className="mb-5" onClick={toggleField}>
        {showField ? 'Remove Language' : 'Add Language'}
      </Button>
      {showField &&
        fields?.map((field: any, index: number) => (
          <MyFormItem
            key={index}
            {...field}
            type="select"
            innerProps={{
              mode: 'multiple',
              options: [
                { label: 'English', value: 'en' },
                { label: 'Arabic', value: 'ar' },
              ],
              onChange: (value: any) => {
                console.log(value);

                formRef.setFieldsValue({
                  [field.name]: value,
                });
              },
            }}
          />
        ))}
    </>
  );
}
