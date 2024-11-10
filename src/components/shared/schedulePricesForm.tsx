import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Select, Space } from 'antd';
import React, { useEffect } from 'react';

import { EnumKeys } from '@/api/enums';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

const { Option } = Select;

interface Props {
  onSubmit?: (value: any) => void;
  activityData?: any;
  showSubmit?: boolean;
  formRef?: any;
  key?: any;
  onChange?: (data: any) => void;
  view?: 'readOnly' | 'edit';
}

const SchedulePricesForm = ({ onSubmit, activityData, formRef, showSubmit = true, onChange, view = 'edit' }: Props) => {
  const form = formRef || Form.useForm()[0];

  const { formatMessage } = useLocale();

  const { data: clientTypes } = useEnum({ enumKey: EnumKeys.ClientType });
  const { data: currencies } = useEnum({ enumKey: EnumKeys.Currencys });
  const { data: SchedulePriceModifiers } = useEnum({ enumKey: EnumKeys.SchedulePriceModifiers });

  console.log(SchedulePriceModifiers);

  console.log(activityData?.schedule_prices);
  console.log(activityData);

  useEffect(() => {
    if (activityData) {
      form.setFieldsValue({
        schedule_prices: activityData?.schedule_prices?.map((item: any) => ({
          price: item.price,
          currency: item.currency,
          modifiers: item.modifiers.map((el: any) => ({
            modifierType: el._type === 'language_modifier' ? 'language_modifier' : 'age_range_modifier',
            age_range_type: el?._type,
            client_type: el?.client_type,
            minimum_age: el?.minimum_age,
            maximum_age: el?.maximum_age,
            minimum_participants: el?.minimum_participants,
            maximum_participants: el?.maximum_participants,
            language: el.language,
          })),
        })),
      });
    }
  }, [activityData]);

  const onModifierTypeChange = (index: any, modifierIndex: any) => (value: any) => {
    const currentValues = form.getFieldsValue();

    currentValues.schedule_prices[index].modifiers[modifierIndex].modifierType = value;
    form.setFieldsValue(currentValues);
  };

  const onAgeRangeTypeChange = (index: any, modifierIndex: any) => (value: any) => {
    const currentValues = form.getFieldsValue();

    currentValues.schedule_prices[index].modifiers[modifierIndex].age_range_type = value;
    form.setFieldsValue(currentValues);
  };

  const onFinish = (values: any) => {
    console.log(values);

    const formattedValues = values?.schedule_prices?.map((item: any) => ({
      price: item.price,
      currency: item.currency,
      modifiers: item?.modifiers.map((modifier: any) => {
        let commonModifier = { _type: modifier.modifierType };

        if (modifier.modifierType === 'age_range_modifier') {
          commonModifier = {
            _type: modifier.age_range_type,
          };

          return {
            ...commonModifier,
            ...(modifier.age_range_type === 'client_type_age_range'
              ? {
                  client_type: modifier.client_type,
                  minimum_age: modifier.minimum_age,
                  maximum_age: modifier.maximum_age,
                }
              : {}),
            maximum_participants: modifier.maximum_participants,
            minimum_participants: modifier.minimum_participants,
          };
        } else if (modifier.modifierType === 'language_modifier') {
          return {
            ...commonModifier,
            language: modifier.language,
          };
        }

        return commonModifier;
      }),
    }));

    console.log(formattedValues);

    onSubmit?.(formattedValues);
  };

  return (
    <Form onChange={onChange} form={form} onFinish={onFinish} layout="vertical">
      <Form.List name="schedule_prices">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key} className="mb-5 flex flex-col border-[2px] border-gray-500 p-3 rounded-3xl">
                <div className="flex space-x-5">
                  <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    label={formatMessage({ id: 'general.price' })}
                    rules={[{ required: true, message: 'Please input the price!' }]}
                  >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'currency']}
                    label={formatMessage({ id: 'general.currency' })}
                    rules={[{ required: true, message: 'Please select a currency!' }]}
                  >
                    <Select placeholder="Select a currency">
                      {currencies?.map((el: any, index: number) => (
                        <Option value={el?.id} key={index}>
                          {el.suggestion}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="">
                  <Form.List name={[name, 'modifiers']}>
                    {(modifiersFields, { add: addModifier, remove: removeModifier }) => (
                      <>
                        {modifiersFields.map(
                          ({ key: modifierKey, name: modifierName, ...modifierRestField }, modifierIndex) => (
                            <div
                              key={modifierKey}
                              className="w-full mb-5 flex flex-col space-x-5 border-[1px] border-[#EA5740] p-3 rounded-3xl"
                            >
                              <Form.Item
                                {...modifierRestField}
                                name={[modifierName, 'modifierType']}
                                label={formatMessage({ id: 'general.modifier_type' })}
                                rules={[{ required: true, message: 'Please select a modifier type!' }]}
                              >
                                <Select
                                  placeholder="Select a modifier type"
                                  onChange={onModifierTypeChange(index, modifierIndex)}
                                >
                                  <Option value="age_range_modifier">Age Range Modifier</Option>
                                  <Option value="language_modifier">Language Modifier</Option>
                                </Select>
                              </Form.Item>

                              {form.getFieldValue([
                                'schedule_prices',
                                index,
                                'modifiers',
                                modifierIndex,
                                'modifierType',
                              ]) === 'age_range_modifier' && (
                                <>
                                  <Form.Item
                                    {...modifierRestField}
                                    name={[modifierName, 'age_range_type']}
                                    label={formatMessage({ id: 'general.age_range_type' })}
                                    rules={[{ required: true, message: 'Please select an age range type!' }]}
                                  >
                                    <Select
                                      placeholder="Select an age range type"
                                      onChange={onAgeRangeTypeChange(index, modifierIndex)}
                                    >
                                      <Option value="client_type_age_range">Client Type Age Range</Option>
                                      <Option value="general_age_range">General Age Range</Option>
                                    </Select>
                                  </Form.Item>

                                  {form.getFieldValue([
                                    'schedule_prices',
                                    index,
                                    'modifiers',
                                    modifierIndex,
                                    'age_range_type',
                                  ]) === 'client_type_age_range' && (
                                    <div className="flex space-x-5">
                                      <Form.Item
                                        {...modifierRestField}
                                        name={[modifierName, 'client_type']}
                                        label={formatMessage({ id: 'general.client_type' })}
                                        rules={[{ required: true, message: 'Please select a client type!' }]}
                                      >
                                        <Select placeholder="Select a client type">
                                          {clientTypes?.map((el: any, index: number) => (
                                            <Option value={el.id} key={index}>
                                              {el.suggestion}
                                            </Option>
                                          ))}
                                        </Select>
                                      </Form.Item>

                                      <Form.Item
                                        {...modifierRestField}
                                        name={[modifierName, 'minimum_age']}
                                        label={formatMessage({ id: 'general.min_age' })}
                                        rules={[{ required: true, message: 'Please input the minimum age!' }]}
                                      >
                                        <InputNumber min={0} className="min-w-[130px]" />
                                      </Form.Item>

                                      <Form.Item
                                        {...modifierRestField}
                                        name={[modifierName, 'maximum_age']}
                                        label={formatMessage({ id: 'general.max_age' })}
                                        rules={[{ required: true, message: 'Please input the maximum age!' }]}
                                      >
                                        <InputNumber min={0} className="min-w-[130px]" />
                                      </Form.Item>
                                    </div>
                                  )}

                                  <div className="flex space-x-5">
                                    <Form.Item
                                      {...modifierRestField}
                                      name={[modifierName, 'minimum_participants']}
                                      label={formatMessage({ id: 'general.min_participants' })}
                                      rules={[{ required: true, message: 'Please input the minimum participants!' }]}
                                    >
                                      <InputNumber min={0} className="min-w-[130px]" />
                                    </Form.Item>

                                    <Form.Item
                                      {...modifierRestField}
                                      name={[modifierName, 'maximum_participants']}
                                      label={formatMessage({ id: 'general.max_participants' })}
                                      rules={[{ required: true, message: 'Please input the maximum participants!' }]}
                                    >
                                      <InputNumber min={0} className="min-w-[130px]" />
                                    </Form.Item>
                                  </div>
                                </>
                              )}

                              {form.getFieldValue([
                                'schedule_prices',
                                index,
                                'modifiers',
                                modifierIndex,
                                'modifierType',
                              ]) === 'language_modifier' && (
                                <Form.Item
                                  {...modifierRestField}
                                  name={[modifierName, 'language']}
                                  label={formatMessage({ id: 'general.language' })}
                                  rules={[{ required: true, message: 'Please select a language!' }]}
                                >
                                  <Select placeholder="Select a language">
                                    <Option value="PT">PT</Option>
                                    <Option value="ES">ES</Option>
                                    <Option value="FR">FR</Option>
                                    <Option value="EN">EN</Option>
                                  </Select>
                                </Form.Item>
                              )}

                              {view === 'edit' && <MinusCircleOutlined onClick={() => removeModifier(modifierName)} />}
                            </div>
                          ),
                        )}

                        {view === 'edit' && (
                          <Form.Item>
                            <Button type="dashed" onClick={() => addModifier()} block icon={<PlusOutlined />}>
                              {formatMessage({ id: 'general.add_modifier' })}
                            </Button>
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form.List>
                </div>

                {view === 'edit' && <MinusCircleOutlined onClick={() => remove(name)} />}
              </div>
            ))}

            {view === 'edit' && (
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {formatMessage({ id: 'general.add_item' })}
                </Button>
              </Form.Item>
            )}
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
  );
};

export default SchedulePricesForm;
