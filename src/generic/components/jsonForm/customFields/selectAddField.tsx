import type { RootState } from '@/generic/stores';
import type { FieldProps } from '@rjsf/utils';

import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Select } from 'antd'; // Assuming you're using Ant Design
import axios from 'axios'; // Import axios or use fetch
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ApiBaseUrl } from '@/generic/api/request';
import useModal from '@/generic/hooks/useModal';

import MyButton from '../../basic/button';
import JsonFormComp from '../../crudTable/jsonFormComp';

const { Option } = Select;

interface Props extends FieldProps {}

export default function SelectAddFields({ onChange, uiSchema, schema, formData }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [addFormData, setAddFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  console.log(schema);

  console.log(uiSchema);

  const { currentConceptId } = useSelector((state: RootState) => state.form);

  console.log(currentConceptId);

  const { showModal, renderModal, hideModal } = useModal({
    modalProps: {
      footer: null,
      styles: { body: { maxHeight: '500px', overflowY: 'scroll' } },
    },
  });

  const apiRoute = uiSchema?.['ui:apiRoute'];
  const submitRoute = uiSchema?.['ui:submitRoute'];
  const suggestionRoute = uiSchema?.['ui:suggestionsRoute'];
  const selectMode = uiSchema?.['ui:selectMode'];

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('t')}`,
    },
  };

  useEffect(() => {
    if (formData) {
      setSelectedOption(formData);
    } else {
      setSelectedOption(null);
    }
  }, [formData]);

  useEffect(() => {
    handleGetSuggestions();
  }, []);

  useEffect(() => {
    if (addFormData) {
      showModal(
        <JsonFormComp
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          jsFormProps={{ schema: addFormData?.schema, uiSchema: addFormData?.ui_schema }}
          onFinish={e => handleSubmit(e)}
        />,
        750,
      );
    }
  }, [addFormData]);

  const handleSubmit = async (data: any) => {
    console.log(data);

    try {
      const response = await axios.post(ApiBaseUrl + submitRoute, data, config);

      if (response?.data) {
        message.success('Added successfully.');
        handleGetSuggestions();
      }

      hideModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSuggestions = async () => {
    const params: any = {};

    if (currentConceptId) {
      params['id'] = currentConceptId;
    }

    const response = await axios.get(ApiBaseUrl + `${suggestionRoute}?${new URLSearchParams(params)}`, config);

    setSuggestions(response?.data);
  };

  const handleGetAddForm = async () => {
    if (!apiRoute) return;

    setLoading(true);

    try {
      const response = await axios.post(ApiBaseUrl + apiRoute, {}, config);

      setAddFormData(response?.data);
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (value: any) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="mt-[3px]">
      <label>{schema?.title}</label>
      <div className="flex items-center space-x-4 mt-4">
        <Select
          style={{ minWidth: 200 }}
          placeholder="Select an option"
          value={selectedOption}
          onChange={value => handleOnChange(value)}
          dropdownStyle={{ minWidth: 200 }}
          mode={selectMode}
        >
          {suggestions?.map(({ id, suggestion }: { id: string; suggestion: string }) => (
            <Option key={id} value={id}>
              {suggestion}
            </Option>
          ))}
        </Select>

        {submitRoute && <MyButton icon={<PlusOutlined />} onClick={handleGetAddForm} loading={loading} />}

        {renderModal()}
      </div>
    </div>
  );
}
