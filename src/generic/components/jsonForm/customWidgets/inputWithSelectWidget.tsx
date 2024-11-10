import type { WidgetProps } from '@rjsf/utils';

import { Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

interface Props extends WidgetProps {}

export default function InputWithSelectWidget({ value = {}, onChange, schema }: Props) {
  const handleSelectChange = (selectedValue: string) => {
    const updatedValue = { ...value, [schema.selectKey]: selectedValue };

    onChange(updatedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = { ...value, [schema?.textKey]: e.target.value };

    console.log(updatedValue);

    onChange(updatedValue);
  };

  return (
    <Input
      value={value[schema?.textKey] || ''}
      onChange={handleInputChange}
      placeholder="Enter text"
      addonAfter={
        <Select
          value={value[schema.selectKey] || ''}
          onChange={handleSelectChange}
          style={{ width: '120px' }}
          placeholder={schema?.placeHolder ?? 'Select'}
        >
          {schema.enum?.map((option: any) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      }
      style={{ width: '320px' }}
    />
  );
}
