import { useLocale } from '@/locales';

const useCards = () => {
  const { formatMessage } = useLocale();

  const data = (data: any) => [
    {
      label: formatMessage({ id: 'reservation.status' }),
      value: data.status,
    },
    {
      label: formatMessage({ id: 'reservation.reservation_date' }),
      value: data.reservation_date,
    },
    {
      label: formatMessage({ id: 'reservation.email' }),
      value: data.email,
    },
    {
      label: formatMessage({ id: 'reservation.activity_name' }),
      value: data.activity_schedule.title,
    },
    {
      label: formatMessage({ id: 'reservation.payment_link' }),
      value: data.payment_method.payment_link,
    },
    {
      label: formatMessage({ id: 'reservation.total_price' }),
      value: data.total_price,
    },
  ];

  return data;
};

export default useCards;
