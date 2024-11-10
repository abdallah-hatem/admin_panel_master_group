import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import React from 'react';

// import LanguagesFormList from '@/components/shared/activityOption/languagesForm';
// import EditableTable from '@/components/shared/activityOptions/editableTable';
import { getRandomNumber } from '@/generic/helpers/genral';

import MyFormItem from '../form-item';
import FormRow from '../form-row';
import FormListLvl2 from './formListLvl2';

export type FormListProps = { addBtnText?: string; btnStyleTw?: string; formListName: string };

interface Props {
  formRef?: any;
  formListData: any;
  formListProps?: FormListProps;
  iteratinonNum?: number;
}

const clientTypes = [
  { id: 'child', suggestion: 'child' },
  { id: 'children', suggestion: 'children' },
  { id: 'teenager', suggestion: 'teenager' },
  { id: 'adult', suggestion: 'adult' },
  { id: 'military', suggestion: 'military' },
  { id: 'student', suggestion: 'student' },
  { id: 'senior', suggestion: 'senior' },
  { id: 'disabled', suggestion: 'disabled' },
];

export default function FormListComp({ formRef, formListData, formListProps, iteratinonNum }: Props) {
  const style = (iteratinonNum: number) =>
    `w-full border-2 ${
      iteratinonNum === 2 ? 'border-red-500' : iteratinonNum === 1 ? 'border-yellow-500' : 'border-green-500'
    } p-2 rounded-xl`;

  const formValues = formRef?.getFieldsValue();

  console.log(formValues);

  return (
    <Form.List name={formListProps?.formListName ?? ''}>
      {(fields, { add, remove }) => {
        console.log(fields);
        console.log(formListProps?.formListName);

        const isAges = formListProps?.formListName.includes('ages');
        const isLanguages = formListProps?.formListName.includes('languages');
        const shouldDisableButton = (isAges || isLanguages) && fields?.length >= 1;

        return (
          <>
            {fields.map(({ key, name, ...restField }) => {
              console.log(fields);

              return (
                <div key={key} className={style(iteratinonNum ?? 0)}>
                  {formListData({ key, name, ...restField })?.map((item: any, index: number) => {
                    console.log({ key, name, ...restField });
                    console.log(item);
                    console.log(restField);

                    if (item.addAfter) return addAfterComp({ index, item, restField });

                    if (item.formListData) {
                      return (
                        // <FormListComp
                        //   formListData={item.formListData}
                        //   formListProps={item.formListProps}
                        //   formRef={formRef}
                        //   iteratinonNum={index}
                        // />
                        <FormListLvl2
                          key={`${key}-formListLvl2-${index}`}
                          formListData={item.formListData}
                          formListProps={item.formListProps}
                          formRef={formRef}
                          fields={[{ key, name, ...restField }]}
                        />
                      );
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

                    // Default case for form item
                    return <MyFormItem key={`${key}-${index}`} {...item} {...restField} />;
                  })}

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              );
            })}
            <Form.Item>
              <Button
                type="dashed"
                className={formListProps?.btnStyleTw}
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
                disabled={shouldDisableButton}
              >
                {formListProps?.addBtnText || 'Add field'}
              </Button>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );

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
