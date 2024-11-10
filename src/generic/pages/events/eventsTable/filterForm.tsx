import type { schemeType } from '@/generic/components/core/form';

import { useEffect, useState } from 'react';

import { GET_USERS } from '@/api/users';
import { GET_EVENTS_ACTIONS } from '@/generic/api/events';
import MyForm from '@/generic/components/core/form';

interface Props {
  form: any;
  onFilterSubmit: (values: any) => void;
}

export default function FilterForm({ form, onFilterSubmit }: Props) {
  const [users, setUsers] = useState<any>([]);
  const [actions, setActions] = useState<any>([]);

  function getData() {
    GET_USERS().then((res: any) => {
      setUsers(res);
    });

    GET_EVENTS_ACTIONS().then((res: any) => {
      setActions(res);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const data: schemeType[] = [
    {
      label: 'Creation Date',
      name: 'date',
      type: 'range-date-picker',
      required: false,
      innerProps: { style: { width: '100%' } },
    },
    {
      label: 'User',
      name: 'user_ids',
      type: 'select',
      required: false,
      innerProps: { mode: 'multiple' },
      options: users.map((el: any) => ({ label: el.name, value: el.id })),
    },
    {
      label: 'Action',
      name: 'actions',
      type: 'select',
      required: false,
      innerProps: { mode: 'multiple' },
      options: actions.map((el: any) => ({ label: el.suggestion, value: el.id })),
    },
    {
      label: 'Search',
      name: 'search',
      type: 'input',
      required: false,
    },
  ];

  return <MyForm options={data} layout="vertical" form={form} onFinish={onFilterSubmit} />;
}
