import type { ReactNode } from 'react';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Radio, Select, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { EnumKeys } from '@/api/enums';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

import ClientTypesForm from './clientTypeComp';
import EditableTable from './editableTable';
import ModifierForm from './modifierComp';
import SchedulePriceForm from './pricesForm';

const { Option } = Select;

interface Props {
  onSubmit?: (value: any) => void;
  activityData?: any;
  showSubmit?: boolean;
  formRef?: any;
  key?: any;
  onChange?: (data: any) => void;
  label?: ReactNode;
}

const ActivityOptions = ({ onSubmit, activityData, formRef, showSubmit = true, onChange, label }: Props) => {
  const form = formRef || Form.useForm()[0];

  const { formatMessage } = useLocale();

  const { data: clientTypes } = useEnum({ enumKey: EnumKeys.ClientType });
  const { data: currencies } = useEnum({ enumKey: EnumKeys.Currencys });
  const { data: SchedulePriceModifiers } = useEnum({ enumKey: EnumKeys.SchedulePriceModifiers });
  const { data: timeUnits } = useEnum({ enumKey: EnumKeys.TimeUnits });

  const [typesData, setTypesData] = useState<any[]>([]);

  console.log(typesData);

  console.log(activityData?.activity_options);

  console.log(timeUnits);

  useEffect(() => {
    if (activityData && activityData !== undefined) {
      setTypesData([]);
      form.setFieldsValue({
        activity_options: activityData?.activity_options.map((el: any, index: number) => ({
          title: el.title,
          description: el.description,
          cutoff_time: el.cutoff_time,
          cutoff_time_unit: el.cutoff_time_unit,
          schedule_prices: el?.schedule_prices?.map((el2: any) => ({
            price: el2.price,
            currency: el2.currency,
            modifiers: el2?.modifiers?.reverse()?.map((el3: any) => {
              if (el3._type === 'client_type_age_range') {
                console.log(el3);

                setTypesData(prev => [...prev, { index, data: el3.client_types }]);

                return {
                  modifierType: 'age_range_modifier',
                  age_range_type: el3._type,
                  client_type_age_ranges: el3?.client_types?.map((el4: any) => ({
                    client_type: el4.client_type,
                    minimum_age: el4.minimum_age,
                    maximum_age: el4.maximum_age,
                  })),
                  minimum_participants: el3.minimum_participants,
                  maximum_participants: el3.maximum_participants,
                };
              } else if (el3._type === 'language_modifier') {
                return {
                  modifierType: 'language_modifier',
                  language: el3.languages?.map((el: any) => el.language),
                };
              }

              return {};
            }),
          })),
        })),
      });

      console.log(form.getFieldsValue());
    }
  }, [activityData]);

  const onModifierTypeChange = (optionIndex: number, priceIndex: number, modifierIndex: number) => (value: any) => {
    const currentValues = form.getFieldsValue();

    currentValues.activity_options[optionIndex].schedule_prices[priceIndex].modifiers[modifierIndex].modifierType =
      value;
    form.setFieldsValue(currentValues);
  };

  const onAgeRangeTypeChange = (optionIndex: number, priceIndex: number, modifierIndex: number) => (e: any) => {
    const currentValues = form.getFieldsValue();

    currentValues.activity_options[optionIndex].schedule_prices[priceIndex].modifiers[modifierIndex].age_range_type =
      e.target.value;
    form.setFieldsValue(currentValues);
  };

  const onFinish = (values: any) => {
    console.log(values);

    const formattedValues = values?.activity_options?.map((option: any) => ({
      title: option.title,
      description: option.description,
      cutoff_time: option.cutoff_time,
      cutoff_time_unit: option.cutoff_time_unit,
      schedule_prices: option.schedule_prices?.map((price: any) => ({
        price: price.price,
        currency: price.currency,
        modifiers: price.modifiers?.map((modifier: any) => {
          let commonModifier = { _type: modifier.modifierType };

          if (modifier.modifierType === 'age_range_modifier') {
            commonModifier = {
              _type: modifier.age_range_type,
            };

            return {
              ...commonModifier,
              ...(modifier.age_range_type === 'client_type_age_range'
                ? {
                    client_types: modifier.client_type_age_ranges?.map((el: any) => ({
                      client_type: el.client_type,
                      minimum_age: el.minimum_age,
                      maximum_age: el.maximum_age,
                    })),
                    // .filter((el: any) => el.minimum_age > 0),
                  }
                : {}),
              maximum_participants: modifier.maximum_participants,
              minimum_participants: modifier.minimum_participants,
            };
          } else if (modifier.modifierType === 'language_modifier') {
            return {
              ...commonModifier,
              languages: modifier.language?.map((el: any) => ({ language: el })),
            };
          }

          return commonModifier;
        }),
      })),
    }));

    console.log(formattedValues);

    onSubmit?.(formattedValues);
  };

  return (
    <>
      <div className="mb-5">{label}</div>
      <Form onChange={onChange} form={form} onFinish={onFinish} layout="vertical">
        <Form.List name="activity_options">
          {(fieldsF, { add: addOption, remove: removeOption }) => (
            <>
              {fieldsF.map(({ key: optionKey, name: optionName, ...optionRestField }, optionIndex) => (
                <div key={optionKey} className="mb-5 border-[2px] border-green-500 p-3 rounded-3xl">
                  {/* Title and Description */}
                  <Form.Item
                    {...optionRestField}
                    name={[optionName, 'title']}
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...optionRestField}
                    name={[optionName, 'description']}
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                  >
                    <Input.TextArea />
                  </Form.Item>

                  <Form.Item
                    {...optionRestField}
                    name={[optionName, 'cutoff_time']}
                    label={getTitleWithDescription(
                      'Cutoff Time',
                      'This is how long before the experience starts you stop accepting bookings. We recommend setting the cut-off time close to the experience start time to have more customers book your experience',
                    )}
                    className="w-[95%]"
                    rules={[{ required: true, message: 'Please input the cutoff time!' }]}
                  >
                    <Input
                      type="number"
                      className="w-[250px]"
                      addonAfter={
                        <Form.Item
                          {...optionRestField}
                          name={[optionName, 'cutoff_time_unit']}
                          rules={[{ required: true, message: 'Please input the cutoff unit!' }]}
                          // noStyle
                          className="w-[100px] p-0 !h-[5px]"
                        >
                          <Select placeholder="Unit">
                            {timeUnits?.map((el: any) => (
                              <Select.Option key={el.id} value={el.id}>
                                {el.suggestion}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      }
                    />
                  </Form.Item>

                  {/* Schedule Prices */}
                  <SchedulePriceForm
                    activityData={activityData}
                    optionIndex={optionIndex}
                    typesData={typesData}
                    clientTypes={clientTypes}
                    currencies={currencies}
                    optionName={optionName}
                    onModifierTypeChange={onModifierTypeChange}
                    onAgeRangeTypeChange={onAgeRangeTypeChange}
                    form={form}
                    formatMessage={formatMessage}
                  />

                  <MinusCircleOutlined onClick={() => removeOption(optionName)} />
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" className="max-w-fit" onClick={() => addOption()} block icon={<PlusOutlined />}>
                  Add Option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {showSubmit && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="float-right mt-5"
              onClick={e => {
                e.preventDefault();
                form.submit();
              }}
            >
              {formatMessage({ id: 'general.submit' })}
            </Button>
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default ActivityOptions;
