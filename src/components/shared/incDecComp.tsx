import type { ControlTypes } from '@/generic/components/core/form-item';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';

import MyformItem from '@/generic/components/core/form-item';

interface Props {
  increment: () => void;
  decrement: () => void;
  formName: string;
  formType: ControlTypes;
  formInputType?: string;
  placeholder?: string;
  value?: any;
  handleInputChange?: (index: number, val: number, type: 'min' | 'max') => void;
  index?: number;
  type?: 'min' | 'max';
}

export default function IncDecComp({
  increment,
  decrement,
  formName,
  formType,
  formInputType = 'number',
  placeholder = '',
  value,
  handleInputChange,
  index,
  type,
}: Props) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <Button type="primary" className="rounded-full p-0 w-8 h-8" onClick={decrement}>
        <MinusOutlined />
      </Button>

      <Input
        name={formName}
        type={formType}
        className="mb-0 w-[60px]"
        value={value}
        defaultValue={value}
        placeholder={placeholder}
        style={{ textAlign: 'center' }}
        onChange={e => {
          handleInputChange && handleInputChange(index ?? -1, Number(e.target.value), type ?? 'min');
        }}
      />

      <Button type="primary" className="rounded-full p-0 w-8 h-8" onClick={increment}>
        <PlusOutlined />
      </Button>
    </div>
  );
}
