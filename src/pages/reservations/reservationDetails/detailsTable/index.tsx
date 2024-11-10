import { CREATE_RESERVATION, DELETE_RESERVATION, GET_RESERVATIONS_BY_ID, UPDATE_RESERVATION } from '@/api/reservations';
import CrudTable from '@/generic/components/crudTable';

import { useAddFormData } from './forms/add';
import useColumns from './forms/columns';

interface Props {
  reservationId: number;
  reservationDetails: any;
}

export default function DetailsTable({ reservationId, reservationDetails }: Props) {
  console.log(reservationDetails);

  const columns = useColumns();
  const addFormData = useAddFormData();

  return (
    <CrudTable
      // ADD={CREATE_RESERVATION}
      // GET={GET_RESERVATIONS_BY_ID}
      customOnFinish={e => console.log(e)}
      pageParams={{ id: reservationId }}
      // ARCHIVE={DELETE_RESERVATION}
      // UPDATE={UPDATE_RESERVATION}
      customColumns={columns}
      data={addFormData}
      tableCompData={reservationDetails ?? []}
      title="Reservation details"
      // modalContentStyleTw="w-[300px]"
      modalProps={{ width: 750 }}
      tableStyleTw="max-w-[99%] mx-auto"
    />
  );
}
