import type { schemeType } from '@/generic/components/core/form';

import { EnumKeys } from '@/api/enums';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

import useFormListData from './formListData';

interface Props {
  formRef: any;
  type?: 'schedule_prices' | 'full_activity_option';
}

const useFormData = ({ formRef, type }: Props) => {
  const { data: timeUnits } = useEnum({ enumKey: EnumKeys.TimeUnits });

  const formListData = useFormListData({ formRef });

  const { formatMessage } = useLocale();

  const data1: schemeType = [
    {
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.title' }),
        formatMessage({ id: 'activities.form.activity_options_title_desc' }),
      ),
      name: 'title',
      type: 'input',
      required: true,
      hidden: type === 'schedule_prices',
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.title' }),
        },
      ],
    },
    {
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.activity_description' }),
        formatMessage({ id: 'activities.form.activity_description_desc' }),
      ),
      name: 'description',
      type: 'textarea',
      required: true,
      hidden: type === 'schedule_prices',
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.activity_description' }),
        },
      ],
    },
    {
      // label: 'Cutoff Time',
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.cutoff_time' }),
        formatMessage({ id: 'activities.form.cutoff_time_desc' }),
      ),
      name: 'cutoff_time',
      type: 'input',
      required: true,
      hidden: type === 'schedule_prices',
      className: 'w-full',
      addAfter: {
        placeHolder: 'Select unit',
        data: timeUnits?.map((el: any) => ({ label: el.suggestion, value: el.id })),
        name: 'cutoff_time_unit',
        innerProps: { required: true },
        rules: [{ required: true }],
      },
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.cutoff_time' }),
        },
      ],
    },
  ];

  const data: schemeType = [
    ...(type !== 'schedule_prices' ? data1 : []),
    {
      required: true,
      formListData,
      formListProps: {
        addBtnText: 'Add Price',
        formListName: 'schedule_prices',
        btnStyleTw: 'mt-8',
      },
      formRef,
      innerProps: { rules: [{ required: true, message: 'Please select at least one price!' }] },
      rules: [{ required: true, message: 'Please select at least one price!' }],
    },
  ];

  return data;
};

export default useFormData;
