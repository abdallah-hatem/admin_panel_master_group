import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useEffect, useState } from 'react';

import MyFormItem from '../form-item';
import FormRow from '../form-row';

export type FormListProps = { addBtnText?: string; btnStyleTw?: string; formListName: string[] };

interface Props {
  formRef?: any;
  formListData: any;
  formListProps?: FormListProps;
  iterationNum?: number;
  fields?: any;
}

export default function FormListLvl2({ formListData, formListProps, fields, formRef }: Props) {
  const [visibleFields, setVisibleFields] = useState<{ [key: number]: boolean }>({}); // Track visibility of fields

  useEffect(() => {
    if (formRef) {
      console.log(formRef.getFieldsValue());

      const updatedVisibleFields = fields.reduce((acc: any, { key }: any) => {
        const fieldPathAges = ['schedule_prices', key, 'client_types_table'];
        const fieldPathAgesGeneral = ['schedule_prices', key, 'client_types'];
        const fieldPathLang = ['schedule_prices', key, 'languages'];

        const fieldValueAges = formRef.getFieldValue(fieldPathAges);
        const fieldValueAgesGeneral = formRef.getFieldValue(fieldPathAgesGeneral);
        const fieldValueLang = formRef.getFieldValue(fieldPathLang);

        // Check if formListName includes 'ages' or 'languages' and has data
        if (
          formListProps?.formListName.includes('ages') &&
          (fieldValueAges?.length > 0 || fieldValueAgesGeneral?.length > 0)
        ) {
          acc[key] = true;
        } else if (formListProps?.formListName.includes('languages') && fieldValueLang?.length > 0) {
          acc[key] = true;
        } else {
          acc[key] = false;
        }

        return acc;
      }, {});

      setVisibleFields(updatedVisibleFields);
    }
  }, [formRef, fields, formListProps]);

  const handleToggleField = (key: number) => {
    setVisibleFields(prev => ({ ...prev, [key]: !prev[key] })); // Toggle field visibility
  };

  return (
    <>
      {fields.map(({ key, name, ...restField }: any) => {
        return (
          <MyFormItem
            key={key}
            className={`border-2 p-2 rounded-xl ${visibleFields[key] ? 'border-orange-700' : 'border-transparent'}`}
          >
            {/* Conditionally render the form item */}
            {visibleFields[key] &&
              formListData({ key, name, ...restField })?.map((item: any, index: number) => {
                if (item.addAfter) {
                  return addAfterComp({ index, item, restField });
                }

                if (item.children) {
                  return (
                    <MyFormItem key={`${key}-child-${index}`} {...item} {...restField}>
                      {item.children}
                    </MyFormItem>
                  );
                }

                if (item?.length > 0) {
                  console.log(item);

                  return <FormRow key={`${key}-${index}`} {...item} {...restField} fields={item} />;
                }

                return <MyFormItem key={`${key}-${index}`} {...item} {...restField} />;
              })}

            {/* Button to toggle field visibility */}
            <Button
              type="dashed"
              className={formListProps?.btnStyleTw}
              onClick={() => handleToggleField(key)}
              icon={visibleFields[key] ? <MinusOutlined /> : <PlusOutlined />}
              block
            >
              {visibleFields[key]
                ? `Hide ${formListProps?.formListName[1]}`
                : (formListProps?.addBtnText ?? 'Add Field')}
            </Button>
          </MyFormItem>
        );
      })}
    </>
  );

  // Component to handle addonAfter logic
  function addAfterComp({ index, item, restField }: { index: any; item: any; restField: any }) {
    return (
      <div key={index} className="flex">
        <MyFormItem
          {...item}
          {...restField}
          innerProps={{
            addonAfter: (
              <Form.Item label=" " {...item.addAfter} rules={item.addAfter?.rules} {...restField} noStyle>
                <Select
                  showSearch
                  placeholder={item.addAfter?.placeHolder || 'Select unit'}
                  options={item.addAfter?.data}
                  disabled={item.addAfter?.disabled}
                />
              </Form.Item>
            ),
          }}
        />
      </div>
    );
  }
}
