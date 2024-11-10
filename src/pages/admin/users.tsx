import type { MyPageTableOptions } from '@/generic/components/business/page';

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useEffect, useState } from 'react';

import { ARCHIVE_USER, GET_ACTIVE_USERS } from '@/api/users';
import { GET_ROLES } from '@/generic/api/roles';
import MyButton from '@/generic/components/basic/button';
import MyModal from '@/generic/components/basic/modal';
import TableComp from '@/generic/components/business/page';
import { createTableColumns, createTagColumn } from '@/generic/components/core/table/utils';

import AddUser from './addUser';
import UpdateUser from './updateUser';

export default function Users() {
  const [action, setAction] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [openedUpdate, setOpenedUpdate] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    GET_ROLES().then((res: any) => setRoles(res));
  }, []);

  useEffect(() => {
    currentUser && triggerModalUpdate();
  }, [currentUser]);

  const triggerModal = () => setOpened(prev => !prev);
  const triggerModalUpdate = () => setOpenedUpdate(prev => !prev);

  const colorMapping = {
    admin: 'green',
    operator: 'red',
    Guest: 'blue',
    // add other known roles and their colors here
  };

  const handleMenuClick = async (e: any, record: any) => {
    if (e.key === 'update') {
      setCurrentUser(record);
    } else if (e.key === 'delete') {
      ARCHIVE_USER(record.id).then(res => {
        setAction(prev => !prev);

        if (!res.status) return;

        message.success('Archived successfully');
      });
    }
  };

  const actions = [
    {
      key: 'update',
      label: 'Update',
      icon: <EditOutlined />,
      onClick: handleMenuClick,
    },
    {
      key: 'delete',
      label: 'Archive',
      icon: <DeleteOutlined />,
      confirm: true,
      confirmMessage: 'Are you sure you want to archive this user?',
      onClick: handleMenuClick,
    },
  ];

  const customColumns: MyPageTableOptions<any> = [
    { title: 'Name', dataIndex: 'name', key: 'id' },
    { title: 'Email', dataIndex: 'email', key: 'id' },
    createTagColumn('Roles', 'roles', 'roles', colorMapping),
    { title: 'Creation date', dataIndex: 'inserted_at', key: 'id' },
  ];

  const tableColumns = createTableColumns(customColumns, actions);

  const topButtons = [
    <MyButton icon={<PlusOutlined />} onClick={triggerModal}>
      Create a new user
    </MyButton>,

    <MyButton icon={<ReloadOutlined />} onClick={() => setAction((prev: any) => !prev)}>
      Refresh
    </MyButton>,
  ];

  return (
    <>
      <div className="px-5">
        <TableComp
          topButtons={topButtons}
          pageApi={GET_ACTIVE_USERS}
          // onRowClick={(record: any) => router(`/categories/updateCategory/${record.id}`)}
          action={action}
          tableOptions={tableColumns}
        ></TableComp>
      </div>

      <MyModal title="Create a new user" open={opened} footer={[]} onCancel={triggerModal} width={800}>
        <AddUser roles={roles} triggerModal={triggerModal} setAction={setAction} />
      </MyModal>

      <MyModal
        title="Update user"
        open={openedUpdate}
        footer={[]}
        onCancel={() => {
          triggerModalUpdate();
          setCurrentUser(null);
        }}
        width={800}
      >
        <UpdateUser
          setAction={setAction}
          triggerModalUpdate={triggerModalUpdate}
          currentUser={currentUser}
          roles={roles}
        />
      </MyModal>
    </>
  );
}
