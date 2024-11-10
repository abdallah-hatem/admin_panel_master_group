import type { schemeType } from '@/generic/components/core/form';

import { useState } from 'react';

import { EnumKeys } from '@/api/enums';
import { getOptions } from '@/generic/helpers/genral';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

import UntilSection from '../untilSection';

interface Props {
  formRef?: any;
  handleEndChange: (data: any) => void;
  endType: any;
  activityOptionsSuggestions: any[];
  getStartAndEndDate?: any;
}

export const useAddFormData = ({
  formRef,
  endType,
  handleEndChange,
  activityOptionsSuggestions,
  getStartAndEndDate,
}: Props) => {
  const { formatMessage } = useLocale();

  const [reRenderComp, setReRenderComp] = useState<boolean>(true);

  const { data: frequncies } = useEnum({ enumKey: EnumKeys.Frequency });
  const { data: timeUnits } = useEnum({ enumKey: EnumKeys.TimeUnits });

  const days = [
    { label: 'M', value: '0' },
    { label: 'T', value: '1' },
    { label: 'W', value: '2' },
    { label: 'T', value: '3' },
    { label: 'F', value: '4' },
    { label: 'S', value: '5' },
    { label: 'S', value: '6' },
  ];

  console.log(getStartAndEndDate);

  const data: schemeType[] = [
    {
      label: 'Activity option',
      name: 'activity_options_ids',
      type: 'select',
      options: getOptions(activityOptionsSuggestions, 'suggestion'),
      // innerProps: { mode: 'multiple' },
      required: true,
    },
    {
      label: formatMessage({ id: 'general.repeat_every' }),
      name: 'interval',
      type: 'input-number',
      addAfter: {
        data: getOptions(frequncies),
        name: 'frequency',
        label: 'frequency',
        placeHolder: 'Select',
        formRef,
        // defaultValue: formRef.getFieldValue('frequency'),
        onChange: e => {
          setReRenderComp(prev => !prev);
          if (e !== 'weekly') formRef.setFieldValue('byweekday', null);
        },
        required: true,
      },
      required: true,
    },
    {
      label: formatMessage({ id: 'general.repeat_on' }),
      name: 'byweekday',
      type: 'checkbox',
      innerProps: { options: days },
      required: formRef.getFieldValue('frequency') === 'weekly',
      hidden: formRef.getFieldValue('frequency') !== 'weekly',
    },
    [
      {
        label: formatMessage({ id: 'general.starts_on' }),
        name: 'dtstart',
        type: 'date-picker',
        required: true,
        innerProps: { showTime: true },
      },
      {
        label: formatMessage({ id: 'general.ends_after' }),
        name: 'duration',
        type: 'input-number',
        addAfter: {
          data: getOptions(timeUnits),
          name: 'duration_unit',
          label: 'duration unit',
          placeHolder: 'Select',
          formRef,
          required: true,
        },
        required: true,
      },
    ],
    {
      children: getStartAndEndDate && (
        <div className="flex flex-row gap-5 justify-center">
          <p>Start Date: {getStartAndEndDate?.startDate}</p>
          <p>End Date: {getStartAndEndDate?.endDate}</p>
        </div>
      ),
    },
    {
      label: formatMessage({ id: 'general.until' }),
      name: 'until',
      required: true,
      children: <UntilSection endType={endType} handleEndChange={handleEndChange} />,
    },
  ];

  return data;
};
