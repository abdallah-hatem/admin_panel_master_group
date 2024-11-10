import type { WidgetProps } from '@rjsf/utils';

import { Select } from 'antd';

const { Option } = Select;

interface Props extends WidgetProps {
  customOnChange?: (value: any) => void;
}

export default function SelectWidget({ value, onChange, schema, options, disabled, customOnChange }: Props) {
  console.log(value);

  return (
    <Select
      value={value}
      onChange={newValue => onChange(newValue)}
      disabled={disabled}
      style={{ width: '100%' }}
      placeholder={options?.placeholder || 'Select an option'}
    >
      {schema.enum?.map((option: any, index: number) => (
        <Option key={index} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
}
