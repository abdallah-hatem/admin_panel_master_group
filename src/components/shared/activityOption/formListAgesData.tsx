import { useEffect, useState } from 'react';

import { EnumKeys } from '@/api/enums';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

import EditableTable from '../activityOptions/editableTable';

interface Props {
  formRef?: any;
}

const useFormListAgesData = ({ formRef }: Props) => {
  const { data: clientTypes } = useEnum({ enumKey: EnumKeys.ClientType });
  const { formatMessage } = useLocale();

  // State to hold whether the age range is selected or not for each field
  const [ageRangeSelected, setAgeRangeSelected] = useState<{ [key: number]: boolean }>({});

  // Handle change for radio buttons
  const handleClientTypeChange = (fieldKey: number, value: string) => {
    console.log(fieldKey);

    // Check if the selected value is 'age_range'
    setAgeRangeSelected(prev => ({
      ...prev,
      [fieldKey]: value === 'age_range',
    }));
  };

  const formData: any = (field: any) => [
    {
      key: field.key,
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.choose_clients' }),
        formatMessage({ id: 'activities.form.choose_clients_desc' }),
      ),
      name: [field.name, 'client_types'],
      type: 'radio',
      required: true,
      options: [
        { label: 'General', value: 'general' },
        { label: 'Age Range', value: 'age_range' },
      ],
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.choose_clients' }),
        },
      ],
      onChange: (e: any) => handleClientTypeChange(field?.fieldKey, e.target.value), // Detect changes in client_types field
    },
    [
      {
        key: field.key,
        label: formatMessage({ id: 'activities.form.min_participants' }),
        name: [field.name, 'minimum_participants'],
        type: 'input-number',
        required: true,
        innerProps: { className: 'w-[80%]' },
      },
      {
        key: field.key,
        label: formatMessage({ id: 'activities.form.max_participants' }),
        name: [field.name, 'maximum_participants'],
        type: 'input-number',
        innerProps: { className: 'w-[80%]' },
        required: true,
      },
    ],
    {
      key: field.key,
      // label: 'Client Types Table',
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.client_types' }),
        formatMessage({ id: 'activities.form.client_types_desc' }),
      ),
      name: [field.name, 'client_types_table'],
      // hidden: !ageRangeSelected[field?.fieldKey], // Conditionally hide based on the selected client type
      hidden: formRef?.getFieldValue(['schedule_prices', field?.fieldKey, 'client_types']) !== 'age_range', // Conditionally hide based on the selected client type
      children: (
        <EditableTable
          form={formRef}
          clientTypes={clientTypes}
          field={[field.name, 'client_types', field.name, 'client_types']}
        />
      ),
    },
  ];

  return formData;
};

export default useFormListAgesData;
