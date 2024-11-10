import { ADD_ROLE, DELETE_ROLE, GET_ROLES } from '@/generic/api/roles';
import CrudTable from '@/generic/components/crudTable';

import useAddForm from './forms/add';
import useColumns from './forms/columns';

export default function Roles() {
  const tableColums = useColumns();
  const formData = useAddForm();

  return (
    <>
      <CrudTable
        title="Roles"
        ADD={ADD_ROLE}
        ARCHIVE={DELETE_ROLE}
        GET={GET_ROLES}
        onEditRoute="admin/role"
        customColumns={tableColums}
        data={formData}
      />
    </>
  );
}
