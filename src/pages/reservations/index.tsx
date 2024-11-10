import { CREATE_RESERVATION, DELETE_RESERVATION, GET_RESERVATIONS, UPDATE_RESERVATION } from '@/api/reservations';
import CrudTable from '@/generic/components/crudTable';

import { useAddForm } from './forms/add';
import { useColumns } from './forms/columns';

export default function Reservations() {
  const columns = useColumns({});
  const formData = useAddForm({});

  return (
    <CrudTable
      title="Reservation"
      GET={GET_RESERVATIONS}
      // ADD={CREATE_RESERVATION}
      customOnFinish={e => console.log(e)}
      UPDATE={UPDATE_RESERVATION}
      ARCHIVE={DELETE_RESERVATION}
      customColumns={columns}
      data={formData}
      tableStyleTw="max-w-[80vw] mx-auto"
      onRowClickRoute="activities/reservation"
      submitStyleTw="mt-5"
      // getJsonFormDataAdd={GET_RESERVATIONS_SCHEMA_ADD}
      // getJsonFormDataUpdate={GET_RESERVATIONS_SCHEMA_UPDATE}
      // getJsonFormColumnsAndFilters={GET_RESERVATIONS_SCHEMA_COLUMNS}
    />
  );
}
