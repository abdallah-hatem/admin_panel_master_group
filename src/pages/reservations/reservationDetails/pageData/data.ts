import type { schemeType } from '@/generic/components/core/form';

import { EnumKeys } from '@/api/enums';
import { getOptions } from '@/generic/helpers/genral';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

const useData = () => {
  const { formatMessage } = useLocale();

  const { data: paymentStatus } = useEnum({ enumKey: EnumKeys.PaymentStatus });

  const data: schemeType[] = [
    [
      {
        label: formatMessage({ id: 'general.status' }),
        name: 'status',
        required: false,
        type: 'select',
        options: getOptions(paymentStatus),
      },
      {
        label: formatMessage({ id: 'general.email' }),
        name: 'email',
        required: false,
        type: 'input',
      },
    ],
  ];

  return data;
};

export default useData;
