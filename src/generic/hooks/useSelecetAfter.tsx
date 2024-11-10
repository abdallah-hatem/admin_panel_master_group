import type { RootState } from '../stores';

import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import MyFormItem from '../components/core/form-item';

const { Option } = Select;

interface OptionData {
  id: string;
  suggestion?: string;
  value?: string;
}

interface AddAfterOption {
  name: string;
  placeHolder: string;
  formRef?: any;
  data?: OptionData[];
  onChange?: (value: any) => void;
  required?: boolean;
  label?: string;
}

interface Props {
  data?: AddAfterOption;
  defaultValue?: any;
  disabled?: boolean;
}

const useSelectAfter = ({ data, defaultValue, disabled }: Props) => {
  const [val, setVal] = useState(defaultValue ?? null);

  console.log(val);
  console.log(data?.formRef?.getFieldValue(data?.name));

  const { selectDefValue } = useSelector((state: RootState) => state.form);

  console.log(data);

  useEffect(() => {
    if (selectDefValue) {
      setVal(selectDefValue);
    }
  }, [selectDefValue]);

  return (
    <MyFormItem noStyle required={data?.required} name={data?.name} label={data?.label}>
      <Select
        placeholder={data?.placeHolder}
        onChange={(value: any) => {
          data?.formRef?.setFieldsValue({ [data?.name]: value });
          setVal(value);
          data?.onChange?.(value);
        }}
        value={data?.formRef?.getFieldValue(data?.name) ?? val}
        className="min-w-[100px]"
        disabled={disabled}
      >
        {data?.data?.map((el: OptionData, index: number) => (
          <Option key={index} value={el?.id || el?.value}>
            {el?.suggestion ?? el?.value}
          </Option>
        ))}
      </Select>
    </MyFormItem>
  );
};

export default useSelectAfter;
