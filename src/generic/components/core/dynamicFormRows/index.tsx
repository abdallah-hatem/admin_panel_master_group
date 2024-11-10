/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { FormDataGenerator } from '@/generic/components/core/form';
import type { ReactNode } from 'react';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space } from 'antd';

import MyFormItem from '@/generic/components/core/form-item';
import AddUpdate from '@/generic/components/crudTable/addUpdate';
import useModal from '@/generic/hooks/useModal';

import MyButton from '../../basic/button';

export type FormTableProps = { addBtnText?: string; btnStyleTw?: string };

interface Props {
  onFinish?: (value: any) => void;
  formRef?: any;
  name: string;
  data: FormDataGenerator;
  label?: ReactNode;
  formTableProps?: FormTableProps;
}

export default function DynamicFormRows({
  onFinish: _onFinish,
  formRef: _form,
  name,
  data,
  label,
  formTableProps,
}: Props) {
  const { showModal, renderModal, hideModal } = useModal({ modalProps: { footer: null } });

  function MyCustomBtn({ field }: { field: any }) {
    return (
      <MyButton
        className="mt-2"
        icon={<PlusOutlined />}
        onClick={() =>
          showModal(
            <AddUpdate
              triggerModal={hideModal}
              ADD={field?.create}
              data={field?.createFormData}
              onSuccess={field?.onCreateSuccess}
              formRef={field?.formRef}
            />,
            700,
          )
        }
      />
    );
  }

  function FormWithAdd({ field, index }: { field: any; index: number }) {
    return (
      <div className="flex items-center gap-4" key={index}>
        <MyFormItem key={index} {...field} className="w-full" customButton={<MyCustomBtn field={field} />} />

        {renderModal()}
      </div>
    );
  }

  return (
    <div className="mb-5">
      {label ? <div className="my-5">{label}</div> : <h3 className="mb-5">Items</h3>}
      <Form.List name={name}>
        {(fields, { add, remove }) => {
          return (
            <div className={fields.length > 0 ? `border-[1px] border-gray-300 p-3 rounded-3xl` : ''}>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full mb-5 flex justify-between">
                  {/* @ts-expect-error */}
                  {data({ key, name, ...restField })?.map((item: any, index: number) => {
                    if (item.addAfter) {
                      return (
                        <div key={index} className="500 flex">
                          <MyFormItem
                            {...item}
                            {...restField}
                            innerProps={{
                              addonAfter: (
                                <Form.Item label=" " {...item.addAfter} rules={item.addAfter?.rules} {...restField}>
                                  <Select
                                    showSearch
                                    placeholder="Select unit"
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

                    if (item?.createFormData?.length > 0) return <FormWithAdd key={index} field={item} index={index} />;

                    return <MyFormItem {...item} {...restField} />;
                  })}

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className={`${formTableProps?.btnStyleTw}`}
                >
                  {formTableProps?.addBtnText ?? 'Add field'}
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </div>
  );
}
