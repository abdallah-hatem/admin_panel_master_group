import type { schemeType } from '@/generic/components/core/form';

import { EnumKeys } from '@/api/enums';
import { getOptions } from '@/generic/helpers/genral';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

interface Props {
  formRef: any;
}

export const useAddForm = ({ formRef }: Props) => {
  const { data: durations } = useEnum({ enumKey: EnumKeys.Durations });
  const { data: transportTypes } = useEnum({ enumKey: EnumKeys.TransportType });

  const { formatMessage } = useLocale();

  const data: schemeType[] = [
    [
      {
        type: 'input',
        required: true,
        label: formatMessage({ id: 'activities.form.latitude' }),
        name: 'lat',
        innerProps: { disabled: true },
        hidden: true,
      },
      {
        type: 'input',
        required: true,
        label: formatMessage({ id: 'activities.form.longitude' }),
        name: 'lng',
        innerProps: { disabled: true },
        hidden: true,
      },
    ],
    [
      {
        type: 'input',
        required: true,
        label: formatMessage({ id: 'activities.form.title' }),
        name: 'title',
      },
      {
        type: 'select',
        required: true,
        label: formatMessage({ id: 'activities.form.transport_type' }),
        name: 'transport_type',
        options: getOptions(transportTypes, 'suggestions'),
      },
    ],
    [
      {
        type: 'input',
        required: true,
        label: formatMessage({ id: 'activities.form.day_number' }),
        name: 'day_number',
        innerProps: { type: 'number' },
      },
      {
        type: 'input-number',
        required: true,
        label: formatMessage({ id: 'activities.form.duration' }),
        name: 'duration',
        addAfter: {
          data: getOptions(durations),
          name: 'duration_unit',
          placeHolder: formatMessage({ id: 'activities.form.duration_unit' }),
          formRef,
        },
      },
    ],
  ];

  return data;
};
