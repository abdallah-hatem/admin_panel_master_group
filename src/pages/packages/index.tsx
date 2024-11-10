import type { MyPageTableOptions } from '@/generic/components/business/page';

import { message, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DELETE_ACTIVITY_SCHEDULES, GET_ACTIVITY_SCHEDULES, GET_PACKAGES2 } from '@/api/packages';
import MyButton from '@/generic/components/basic/button';
import TableComp from '@/generic/components/business/page';
import { formatDate } from '@/generic/helpers/date';

export default function Packages() {
  const [action, setAction] = useState<boolean>(false);

  const router = useNavigate();

  const tableColums: MyPageTableOptions<any> = [
    { title: 'Title', dataIndex: 'title', key: 'id' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'id',
      width: 180,
    },
    { title: 'Package type', dataIndex: 'package_type', key: 'id', width: 120 },
    { title: 'Price', dataIndex: 'price', key: 'id', width: 100 },
    { title: 'Minimum participants', dataIndex: 'minimum_participants', key: 'id', width: 100 },
    { title: 'Maximum participants', dataIndex: 'maximum_participants', key: 'id', width: 100 },
    { title: 'Activity', dataIndex: 'activity_id', key: 'id', width: 100 },

    // {
    //   title: 'Package items',
    //   dataIndex: 'items',
    //   key: 'id',
    //   width: 100,
    //   render(value, record, index) {
    //     return value.map((el: any) => <Tag>{el.name}</Tag>);
    //   },
    // },
    {
      title: 'Meeting point',
      dataIndex: 'meeting_point',
      key: 'id',
      width: 100,
      render(value, record, index) {
        if (value === null) return 'N/A';
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'id',
      render(value, record, index) {
        return formatDate(value);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <MyButton
            style={{ color: 'blue' }}
            type="text"
            onClick={() => router(`/packages/updatePackage/${record.id}`)}
          >
            update
          </MyButton>
          <MyButton
            type="text"
            onClick={() => {
              DELETE_ACTIVITY_SCHEDULES(record.id);
              setAction(prev => !prev);
              message.success('Deleted successfully');
            }}
            style={{ color: 'red' }}
          >
            Delete
          </MyButton>
        </Space>
      ),
    },
  ];

  return (
    <TableComp
      pageApi={GET_ACTIVITY_SCHEDULES}
      // onRowClick={(record: any) => router(`/categories/updateCategory/${record.id}`)}
      action={action}
      tableOptions={tableColums}
    ></TableComp>
  );
}
