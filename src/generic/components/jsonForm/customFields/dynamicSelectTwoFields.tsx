import type { FieldProps } from '@rjsf/utils';

import { PlusOutlined } from '@ant-design/icons';
import { message, Select } from 'antd'; // Assuming you're using Ant Design
import axios from 'axios'; // Import axios or use fetch
import React, { useEffect, useState } from 'react';

import { ApiBaseUrl } from '@/generic/api/request';
import useModal from '@/generic/hooks/useModal';

import MyButton from '../../basic/button';
import JsonFormComp from '../../crudTable/jsonFormComp';

const { Option } = Select;

interface Props extends FieldProps {}

export default function DynamicSelectTwoFields({ onChange, uiSchema, schema }: Props) {
  const [selectedOptionParent, setSelectedOptionParent] = useState<string | null>(null);
  const [selectedOptionChild, setSelectedOptionChild] = useState<string | null>(null);
  const [addFormDataParent, setAddFormDataParent] = useState<any>(null);
  const [addFormDataChild, setAddFormDataChild] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsParent, setSuggestionsParent] = useState<any>(null);
  const [suggestionsChild, setSuggestionsChild] = useState<any>(null);

  console.log(schema);

  console.log(uiSchema);

  const { showModal, renderModal, hideModal } = useModal({
    modalProps: {
      footer: null,
      styles: { body: { maxHeight: '500px', overflowY: 'scroll' } },
    },
  });

  const parentTitle = uiSchema?.['ui:parentTitle'] || 'Parent';
  const childTitle = uiSchema?.['ui:childTitle'] || 'Child';
  const paramKey = uiSchema?.['ui:paramKey'] || 'id';

  const apiRouteParent = uiSchema?.['ui:apiRouteParent'];
  const submitRouteParent = uiSchema?.['ui:submitRouteParent'];
  const suggestionRouteParent = uiSchema?.['ui:suggestionsRouteParent'];

  const apiRouteChild = uiSchema?.['ui:apiRouteChild'];
  const submitRouteChild = uiSchema?.['ui:submitRouteChild'];
  const suggestionRouteChild = uiSchema?.['ui:suggestionsRouteChild'];

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('t')}`,
    },
  };

  useEffect(() => {
    suggestionRouteChild && handleGetSuggestions('child');

    suggestionRouteParent && handleGetSuggestions('parent');
  }, [suggestionRouteChild, suggestionRouteParent]);

  useEffect(() => {
    if (addFormDataParent) {
      showModal(
        <JsonFormComp
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          jsFormProps={{ schema: addFormData?.schema, uiSchema: addFormData?.ui_schema }}
          onFinish={e => handleSubmit(e, 'parent')}
        />,
        750,
      );
    }
  }, [addFormDataParent]);

  useEffect(() => {
    if (addFormDataChild) {
      showModal(
        <JsonFormComp
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          jsFormProps={{ schema: addFormData?.schema, uiSchema: addFormData?.ui_schema }}
          onFinish={e => handleSubmit(e, 'child')}
        />,
        750,
      );
    }
  }, [addFormDataChild]);

  useEffect(() => {
    if (selectedOptionParent) {
      handleGetSuggestions('child', `${paramKey}=${selectedOptionParent}`);
    }
  }, [selectedOptionParent]);

  const handleSubmit = async (data: any, type: 'parent' | 'child') => {
    console.log(data);

    try {
      const response = await axios.post(
        ApiBaseUrl + type === 'parent' ? submitRouteParent : submitRouteChild,
        data,
        config,
      );

      if (response?.data) {
        message.success('Added successfully.');
        type === 'parent' ? handleGetSuggestions('parent') : handleGetSuggestions('child');
      }

      hideModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSuggestions = async (type: 'parent' | 'child', params?: any) => {
    const response = await axios.get(
      ApiBaseUrl + `${type === 'parent' ? suggestionRouteParent : suggestionRouteChild + '?' + params}`,
      config,
    );

    console.log(response?.data);

    type === 'parent' ? setSuggestionsParent(response?.data) : setSuggestionsChild(response?.data);
  };

  const handleGetAddForm = async (type: 'parent' | 'child') => {
    if (!apiRouteParent || !apiRouteChild) return;

    setLoading(true);

    try {
      const response = await axios.post(ApiBaseUrl + type === 'parent' ? apiRouteParent : apiRouteChild);

      type === 'parent' ? setAddFormDataParent(response?.data) : setAddFormDataChild(response?.data);
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (value: any, type: 'parent' | 'child') => {
    type === 'parent' ? setSelectedOptionParent(value) : setSelectedOptionChild(value);
    onChange(value);
  };

  return (
    <>
      <label>{parentTitle}</label>
      <div className="flex items-center space-x-4 my-4">
        <Select
          style={{ minWidth: 200 }}
          placeholder="Select an option"
          value={selectedOptionParent}
          onChange={value => handleOnChange(value, 'parent')}
          dropdownStyle={{ minWidth: 200 }}
        >
          {suggestionsParent?.map(({ id, suggestion }: { id: string; suggestion: string }) => (
            <Option key={id} value={id}>
              {suggestion}
            </Option>
          ))}
        </Select>

        {submitRouteParent && (
          <MyButton icon={<PlusOutlined />} onClick={() => handleGetAddForm('parent')} loading={loading} />
        )}
      </div>

      <label className="mt-4">{childTitle}</label>
      <div className="flex items-center space-x-4 mt-4">
        <Select
          style={{ minWidth: 200 }}
          placeholder="Select an option"
          value={selectedOptionChild}
          onChange={value => handleOnChange(value, 'child')}
          dropdownStyle={{ minWidth: 200 }}
        >
          {suggestionsChild?.map(({ id, suggestion }: { id: string; suggestion: string }) => (
            <Option key={id} value={id}>
              {suggestion}
            </Option>
          ))}
        </Select>

        {submitRouteChild && (
          <MyButton icon={<PlusOutlined />} onClick={() => handleGetAddForm('child')} loading={loading} />
        )}
      </div>

      {renderModal()}
    </>
  );
}

//  Usage

// const schema: RJSFSchema = {
//   properties: {
//     selectField: {
//       type: 'object',
//       required: ['unit', 'quantity'],
//       selectKey: 'unit',
//       properties: {
//         unit: { type: 'string', enum: ['one', 'two', 'three'] },
//         quantity: { type: 'string' },
//       },
//     },
//   },
// };

// const uiSchema: UiSchema = {
//   selectField: {
//     'ui:field': 'DynamicSelectTwoFields',
//     'ui:apiRouteParent': '/activity-schedule-items/schema',
//     'ui:submitRouteParent': '/activity-schedule-items',
//     'ui:suggestionsRouteParent': '/activity-schedule-items',
//     'ui:parentTitle': 'Parent',

//     'ui:childTitle': 'Child',
//     'ui:apiRouteChild': '/companies/schema',
//     'ui:submitRouteChild': '/companies',
//     'ui:suggestionsRouteChild': '/companies',
//     'ui:paramKey': 'id',
//   },
// };
