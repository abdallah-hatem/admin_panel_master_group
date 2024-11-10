import type { schemeType } from '@/generic/components/core/form';

import { useState } from 'react';

import { GET_ACTIVITIES_MY } from '@/api/activities';
import { EnumKeys } from '@/api/enums';
import { GET_KIOSKS } from '@/api/kiosks';
import { GET_ACTIVITY_SCHEDULES_PRICES_SUGGESTIONS, GET_ACTIVITY_SCHEDULES_SUGGESTIONS } from '@/api/packages';
import { getOptions } from '@/generic/helpers/genral';
import useEnum from '@/generic/hooks/useEnum';
import useFetch from '@/generic/hooks/useFetch';
import { useLocale } from '@/locales';

import useDetailsFormData from './detailsForm/add';

interface Props {}

export const useAddForm = ({}: Props) => {
  const { formatMessage } = useLocale();

  const [activityId, setActivityId] = useState<any>(null);
  const [activityScheduleId, setActivityScheduleId] = useState<any>(null);

  const { data: paymentStatus } = useEnum({ enumKey: EnumKeys.PaymentStatus });
  const { data: paymentMethods } = useEnum({ enumKey: EnumKeys.KioskPaymentMethods });

  const { data: kisosk } = useFetch<any>({ GET: GET_KIOSKS });
  const { data: activitySchedules } = useFetch<any>({
    GET: GET_ACTIVITY_SCHEDULES_SUGGESTIONS,
    params: { activity_id: activityId },
    dependencies: [activityId],
  });
  const { data: activities } = useFetch<any>({ GET: GET_ACTIVITIES_MY });

  const { data: scheduleDetails } = useFetch<any>({
    GET: GET_ACTIVITY_SCHEDULES_PRICES_SUGGESTIONS,
    params: {
      //  id: activityScheduleId,
      params: { activity_id: activityId },
    },
    dependencies: [activityScheduleId],
    allowedToFetch: !!activityScheduleId,
  });

  console.log(scheduleDetails);

  const detailsForm = useDetailsFormData({ options: getOptions(scheduleDetails, 'suggestion') });

  const data: schemeType[] = [
    [
      {
        label: 'Activity',
        name: 'activity_id',
        type: 'select',
        required: true,
        options: getOptions(activities, 'title'),
        innerProps: { onChange: (e: any) => setActivityId(e) },
      },
      {
        label: 'Activity Schedule',
        name: 'activity_schedule_id',
        type: 'select',
        required: true,
        options: getOptions(activitySchedules, 'suggestion'),
        innerProps: { disabled: !activityId, onChange: (e: any) => setActivityScheduleId(e) },
      },
      {
        label: 'Status',
        name: 'status',
        type: 'select',
        // required: true,
        options: getOptions(paymentStatus),
      },
      {
        // label: formatMessage({ id: 'ages.minimum_age' }),
        label: 'Kisosk',
        name: 'kiosk_id',
        type: 'select',
        // required: true,
        options: getOptions(kisosk, 'name'),
      },
    ],
    [
      {
        // label: formatMessage({ id: 'ages.minimum_age' }),
        label: 'Payment Method',
        name: 'payment_method_choice',
        type: 'select',
        // required: true,
        options: getOptions(paymentMethods),
      },
      {
        label: 'Email',
        name: 'email',
        type: 'input',
        // required: true,
        innerProps: { type: 'email' },
      },
    ],
    {
      name: 'details',
      formTableData: detailsForm,
    },
  ];

  return data;
};
