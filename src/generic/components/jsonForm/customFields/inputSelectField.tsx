import type { RootState } from '@/generic/stores';
import type { FieldProps } from '@rjsf/utils';

import { Input, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ApiBaseUrl } from '@/generic/api/request';
import { extractEnum } from '@/generic/helpers/jsonForm';

const { Option } = Select;

interface Props extends FieldProps {}

export default function InputSelectField({ onChange, schema, uiSchema, formData }: Props) {
  const [value, setValue] = useState({});
  const [suggestions, setSuggestions] = useState<any>(null);

  const suggestionRoute = uiSchema?.['ui:suggestionsRoute'];
  const paramKey = uiSchema?.['ui:paramKey'];
  const textKey = uiSchema?.['ui:textKey'];
  const selectKey = uiSchema?.['ui:selectKey'];
  const placeholder = uiSchema?.['ui:placeholder'];
  const inputType = uiSchema?.['ui:inputType'];

  const { currentConceptId } = useSelector((state: RootState) => state.form);

  console.log(currentConceptId);

  console.log(formData);

  console.log(uiSchema);
  console.log(schema);

  console.log(suggestions);

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  const handleSelectChange = (selectedValue: string) => {
    const updatedValue = { ...value, [selectKey]: selectedValue };

    setValue(updatedValue);

    onChange(updatedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    const val = e.target.value;

    const updatedValue = {
      ...value,
      [textKey]: schema?.inputType === 'number' ? Number(val === '' ? null : val) : val === '' ? null : val,
    };

    setValue(updatedValue);

    onChange(updatedValue);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('t')}`,
    },
  };

  const handleGetSuggestions = async () => {
    const params: any = {};

    if (currentConceptId) {
      params[paramKey] = currentConceptId;
    }

    const response = await axios.get(ApiBaseUrl + `${suggestionRoute}?${new URLSearchParams(params)}`, config);

    setSuggestions(response?.data);
  };

  const enums = extractEnum(schema, schema?.selectKey);

  console.log(enums);

  const getOptions = () => {
    if (enums?.length > 0) return enums;

    return suggestions;
  };

  return (
    <div className="mt-[6px] flex flex-col space-y-5">
      <label>{schema?.title}</label>
      <Input
        //   value={value[schema?.textKey] || ''}
        onChange={handleInputChange}
        placeholder="Enter text"
        type={inputType ?? 'text'}
        addonAfter={
          <Select
            //   value={value[schema.selectKey] || ''}
            onChange={handleSelectChange}
            style={{ width: '120px' }}
            placeholder={placeholder ?? 'Select'}
          >
            {getOptions()?.map((option: any) => (
              <Option key={option.id} value={option.id}>
                {option.suggestion}
              </Option>
            ))}
          </Select>
        }
        style={{ width: '320px' }}
      />
    </div>
  );
}
