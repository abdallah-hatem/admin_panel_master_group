import type { schemeType } from '@/generic/components/core/form';

import { EnumKeys } from '@/api/enums';
import { getOptions } from '@/generic/helpers/genral';
import useEnum from '@/generic/hooks/useEnum';

export const useAddFormData = () => {
  const { data: languages } = useEnum({ enumKey: EnumKeys.Languages });
  const { data: clientTypes } = useEnum({ enumKey: EnumKeys.ClientType });

  const data: schemeType[] = [
    [
      // {
      //   label: 'Schedule price',
      //   name: 'schedule_price_id',
      //   type: 'select',
      //   // required: true,
      //   options: [],
      // },
      {
        label: 'Number of people',
        name: 'number_of_people',
        type: 'input',
        required: true,
        innerProps: { type: 'number' },
      },
      {
        label: 'Language',
        name: 'language',
        type: 'select',
        // required: true,
        options: getOptions(languages, 'suggestions'),
      },
      {
        label: 'Client type',
        name: 'client_type',
        type: 'select',
        // required: true,
        options: getOptions(clientTypes, 'suggestions'),
      },
    ],
  ];

  return data;
};
