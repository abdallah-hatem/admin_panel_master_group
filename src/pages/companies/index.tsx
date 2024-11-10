// import type { MyPageTableOptions } from '@/generic/components/business/page';
// import type { schemeType } from '@/generic/components/core/form';

import {
  ADD_COMPANY,
  DELETE_COMPANY,
  GET_COMPANIES,
  GET_COMPANIES_SCHEMA_ADD,
  GET_COMPANIES_SCHEMA_COLUMNS,
  GET_COMPANIES_SCHEMA_UPDATE,
  UPDATE_COMPANY,
} from '@/api/companies';
import CrudTable from '@/generic/components/crudTable';

export default function Companies() {
  // const customColumns: MyPageTableOptions<any> = [{ title: 'Name', dataIndex: 'name', key: 'id' }];

  // const data: schemeType = [{ label: 'Name', name: 'name', type: 'input', required: true }];

  return (
    <CrudTable
      title="Company"
      ADD={ADD_COMPANY}
      ARCHIVE={DELETE_COMPANY}
      GET={GET_COMPANIES}
      UPDATE={UPDATE_COMPANY}
      getJsonFormDataAdd={GET_COMPANIES_SCHEMA_ADD}
      getJsonFormDataUpdate={GET_COMPANIES_SCHEMA_UPDATE}
      getJsonFormColumnsAndFilters={GET_COMPANIES_SCHEMA_COLUMNS}
      showFilterButton
      tableStyleTw="max-w-[99%] mx-auto"
    />
  );
}
