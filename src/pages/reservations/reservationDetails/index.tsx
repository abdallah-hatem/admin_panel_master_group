import type { TabsProps } from 'antd';

import { useParams } from 'react-router-dom';

import { GET_RESERVATIONS_BY_ID, UPDATE_RESERVATION } from '@/api/reservations';
import SchedulePricesForm from '@/components/shared/schedulePricesForm';
import ItemPage from '@/generic/components/business/item_page';
import useFetch from '@/generic/hooks/useFetch';
import { useLocale } from '@/locales';

import DetailsTable from './detailsTable';
import useCards from './pageData/cards';
import useData from './pageData/data';

export default function ReservationDetails() {
  const { id } = useParams();
  const { formatMessage } = useLocale();

  const { data: reservationDetails } = useFetch<any>({ GET: GET_RESERVATIONS_BY_ID, params: { id: String(id) } });

  console.log(reservationDetails);

  const tabsConfig: TabsProps['items'] = [
    {
      key: '1',
      label: formatMessage({ id: 'reservation.details' }),
      children: <DetailsTable reservationId={Number(id)} reservationDetails={reservationDetails?.details} />,
    },
    {
      key: '2',
      label: formatMessage({ id: 'reservation.schedule_prices' }),
      children: (
        <SchedulePricesForm
          activityData={{ schedule_prices: reservationDetails?.activity_schedule?.schedule_prices }}
          showSubmit={false}
          view="readOnly"
        />
      ),
    },
  ];

  const cards = useCards();

  const formData = useData();

  return (
    <ItemPage
      fetchItemById={GET_RESERVATIONS_BY_ID}
      detailsConfig={cards}
      tabsConfig={tabsConfig}
      updateItem={UPDATE_RESERVATION}
      formData={formData}
      modalProps={{ styles: { content: { width: 700, margin: 'auto' } } }}
    />
  );
}
