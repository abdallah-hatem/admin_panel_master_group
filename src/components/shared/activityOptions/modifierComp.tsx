import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Radio, Select } from 'antd';
import React from 'react';

import ClientTypesForm from './clientTypeComp';

const { Option } = Select;

interface ModifierFormProps {
  priceName: any;
  priceIndex: number;
  optionIndex: any;
  onModifierTypeChange: any;
  form: any;
  onAgeRangeTypeChange: any;
  clientTypes: any;
  priceRestField: any;
  formatMessage: any;
  activityData: any;
  typesData: any;
}

const ModifierForm: React.FC<ModifierFormProps> = ({
  priceName,
  priceIndex,
  optionIndex,
  onModifierTypeChange,
  form,
  onAgeRangeTypeChange,
  clientTypes,
  priceRestField,
  formatMessage,
  activityData,
  typesData,
}) => {
  console.log(typesData);

  return (
    <>
      <Form.List name={[priceName, 'modifiers']}>
        {(modifierFields, { add: addModifier, remove: removeModifier }) => (
          <>
            <div className="flex gap-5">
              <Form.Item>
                <Button
                  type="dashed"
                  className="max-w-fit"
                  onClick={() => addModifier({ modifierType: 'language_modifier' })}
                  disabled={
                    modifierFields?.length === 2 ||
                    form.getFieldValue([
                      'activity_options',
                      optionIndex,
                      'schedule_prices',
                      priceIndex,
                      'modifiers',
                      0,
                      'modifierType',
                    ]) === 'language_modifier'
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add languages
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="dashed"
                  className="max-w-fit"
                  onClick={() => addModifier({ modifierType: 'age_range_modifier' })}
                  disabled={
                    modifierFields?.length === 2 ||
                    form.getFieldValue([
                      'activity_options',
                      optionIndex,
                      'schedule_prices',
                      priceIndex,
                      'modifiers',
                      0,
                      'modifierType',
                    ]) === 'age_range_modifier'
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add ages
                </Button>
              </Form.Item>
            </div>

            {modifierFields.map(({ key: modifierKey, name: modifierName, ...modifierRestField }, modifierIndex) => (
              <div key={modifierKey} className="mb-5 flex flex-col border-[1px] border-[#EA5740] p-3 rounded-3xl">
                <Form.Item
                  {...modifierRestField}
                  name={[modifierName, 'modifierType']}
                  label={formatMessage({ id: 'general.modifier_type' })}
                  rules={[{ required: true, message: 'Please select a modifier type!' }]}
                  hidden
                >
                  <Select
                    placeholder="Select a modifier type"
                    onChange={onModifierTypeChange(optionIndex, priceIndex, modifierIndex)}
                    disabled
                  >
                    <Option value="age_range_modifier">Age Range Modifier</Option>
                    <Option value="language_modifier">Language Modifier</Option>
                  </Select>
                </Form.Item>

                {/* Age Range Modifier Form */}
                {form.getFieldValue([
                  'activity_options',
                  optionIndex,
                  'schedule_prices',
                  priceIndex,
                  'modifiers',
                  modifierIndex,
                  'modifierType',
                ]) === 'age_range_modifier' && (
                  <>
                    <Form.Item
                      {...modifierRestField}
                      name={[modifierName, 'age_range_type']}
                      label="Tell us more about your prices"
                      rules={[{ required: true, message: 'Please select an age range type!' }]}
                    >
                      <Radio.Group
                        className="flex flex-col space-y-2"
                        onChange={onAgeRangeTypeChange(optionIndex, priceIndex, modifierIndex)}
                      >
                        <Radio value="general_age_range">This price is the same for everyone</Radio>
                        <Radio value="client_type_age_range">Price depends on age, ex: adult, child, etc...</Radio>
                      </Radio.Group>
                    </Form.Item>

                    {/* Client Type Age Range Form */}
                    {form.getFieldValue([
                      'activity_options',
                      optionIndex,
                      'schedule_prices',
                      priceIndex,
                      'modifiers',
                      modifierIndex,
                      'age_range_type',
                    ]) === 'client_type_age_range' && (
                      <ClientTypesForm
                        clientTypes={clientTypes}
                        modifierName={modifierName}
                        form={form}
                        modifierRestField={modifierRestField}
                        activityData={activityData}
                        formatMessage={formatMessage}
                        modifierIndex={modifierIndex}
                        optionIndex={optionIndex}
                        priceIndex={priceIndex}
                        typesData={typesData}
                      />
                    )}

                    {/* Max and Min Participants */}
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

                {/* Language Modifier Form */}
                {form.getFieldValue([
                  'activity_options',
                  optionIndex,
                  'schedule_prices',
                  priceIndex,
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
                    <Select placeholder="Select a language" mode="multiple">
                      <Option value="PT">PT</Option>
                      <Option value="ES">ES</Option>
                      <Option value="FR">FR</Option>
                      <Option value="EN">EN</Option>
                    </Select>
                  </Form.Item>
                )}

                <MinusCircleOutlined onClick={() => removeModifier(modifierName)} />
              </div>
            ))}
          </>
        )}
      </Form.List>
    </>
  );
};

export default ModifierForm;
