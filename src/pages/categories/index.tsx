import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORIES_SCHEMA_ADD,
  GET_CATEGORIES_SCHEMA_COLUMNS,
  GET_CATEGORIES_SCHEMA_UPDATE,
  UPDATE_CATEGORY,
} from '@/api/categories';
import CrudTable from '@/generic/components/crudTable';

export default function Categories() {
  return (
    <CrudTable
      title="category"
      GET={GET_CATEGORIES}
      ARCHIVE={DELETE_CATEGORY}
      ADD={ADD_CATEGORY}
      UPDATE={UPDATE_CATEGORY}
      getJsonFormDataAdd={GET_CATEGORIES_SCHEMA_ADD}
      getJsonFormDataUpdate={GET_CATEGORIES_SCHEMA_UPDATE}
      getJsonFormColumnsAndFilters={GET_CATEGORIES_SCHEMA_COLUMNS}
      tableStyleTw="max-w-[85vw] mx-auto"
    />
  );
}
