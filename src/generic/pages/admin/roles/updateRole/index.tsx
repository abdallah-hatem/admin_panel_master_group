import type { PermissonsDto } from '@/generic/interface/admin';

import { message } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  ADD_PERMISSIONS_BY_ROLE_ID,
  GET_PERMISSIONS_BY_ROLE_ID,
  GET_ROLES_BY_ID,
  UPDATE_ROLE,
} from '@/generic/api/roles';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import useFetch from '@/generic/hooks/useFetch';

import CollapseSwitch from '../../components/collapseSwitch';
import useAddForm from './forms/add';

export default function UpdateRole() {
  const { id } = useParams();
  const [form] = MyForm.useForm();

  const { data: permissions, refetch } = useFetch<PermissonsDto[] | null>({
    GET: id ? GET_PERMISSIONS_BY_ROLE_ID : undefined,
    params: id ? { id } : undefined,
  });

  const { data: roles } = useFetch<any>({
    GET: id ? GET_ROLES_BY_ID : undefined,
    params: id ? { id } : undefined,
  });

  useEffect(() => {
    if (roles) form.setFieldsValue({ name: roles?.name, description: roles?.description });
  }, [roles]);

  const onChangeSwitch = (checked: boolean, data: any) => {
    const { action } = data;

    id &&
      ADD_PERMISSIONS_BY_ROLE_ID(String(id), { permission_action: action, value: checked })
        .then(() => refetch())
        .finally(() => message.success('Updated successfully'));
  };

  const onFinish = (value: any) => {
    UPDATE_ROLE(Number(id), value).then(res => {
      if (res?.result) message.success('Updated successfully');
    });
  };

  const handleBlurName = (event: any) => {
    // console.log(`${event.target.name} field blurred with value:`, event.target.value);
    UPDATE_ROLE(Number(id), { name: event.target.value }).then(() => {
      message.success('Updated successfully');
    });
  };

  const handleBlurDesc = (event: any) => {
    UPDATE_ROLE(Number(id), { description: event.target.value }).then(() => {
      message.success('Updated successfully');
    });
  };

  const data = useAddForm({ handleBlurDesc, handleBlurName });

  return (
    roles && (
      <div style={{ padding: 20 }}>
        <MyForm options={data} onFinish={onFinish} layout="vertical" form={form} />

        <h2 className="mb-4">Permissons</h2>
        {permissions && (
          <CardComp styleTw="w-full">
            <CollapseSwitch data={permissions} isAdmin={roles?.is_admin} onChangeSwitch={onChangeSwitch} />
          </CardComp>
        )}
      </div>
    )
  );
}
