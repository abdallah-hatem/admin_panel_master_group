import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Select } from 'antd';
import React from 'react';

import ModifierForm from './modifierComp';

const { Option } = Select;

interface SchedulePriceFormProps {
  optionName: any;
  optionIndex: number;
  onModifierTypeChange: any;
  form: any;
  onAgeRangeTypeChange: any;
  clientTypes: any[];
  formatMessage: any;
  currencies: { id: string; suggestion: string }[];
  activityData: any;
  typesData: any;
}

const SchedulePriceForm: React.FC<SchedulePriceFormProps> = ({
  optionName,
  optionIndex,
  onModifierTypeChange,
  form,
  onAgeRangeTypeChange,
  clientTypes,
  formatMessage,
  currencies,
  activityData,
  typesData,
}) => {
  console.log(typesData);

  return (
    <Form.List name={[optionName, 'schedule_prices']}>
      {(priceFields, { add: addPrice, remove: removePrice }) => (
        <>
          {priceFields.map(({ key: priceKey, name: priceName, ...priceRestField }, priceIndex) => (
            <div key={priceKey} className="mb-5 flex flex-col border-[2px] border-gray-500 p-3 rounded-3xl">
              <div className="flex space-x-5">
                <Form.Item
                  {...priceRestField}
                  name={[priceName, 'price']}
                  label={formatMessage({ id: 'general.price' })}
                  rules={[{ required: true, message: 'Please input the price!' }]}
                >
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...priceRestField}
                  name={[priceName, 'currency']}
                  label={formatMessage({ id: 'general.currency' })}
                  rules={[{ required: true, message: 'Please select a currency!' }]}
                >
                  <Select placeholder="Select a currency">
                    {currencies?.map((el, index) => (
                      <Option value={el.id} key={index}>
                        {el.suggestion}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Modifiers */}
              <ModifierForm
                activityData={activityData}
                optionIndex={optionIndex}
                priceIndex={priceIndex}
                typesData={typesData}
                clientTypes={clientTypes}
                onAgeRangeTypeChange={onAgeRangeTypeChange}
                onModifierTypeChange={onModifierTypeChange}
                priceName={priceName}
                priceRestField={priceRestField}
                form={form}
                formatMessage={formatMessage}
              />

              <MinusCircleOutlined onClick={() => removePrice(priceName)} />
            </div>
          ))}

          <Form.Item>
            <Button type="dashed" className="max-w-fit" onClick={() => addPrice()} block icon={<PlusOutlined />}>
              Add Price
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default SchedulePriceForm;
