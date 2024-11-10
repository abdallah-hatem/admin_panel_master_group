/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { TabsProps } from 'antd';

import { Card, Spin, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GET_EVENTS_BY_ID, GET_SUB_EVENTS, GET_SUB_EVENTS_EVENTS, GET_SUB_EVENTS_HISTORY } from '@/generic/api/events';

import AddComment from './addComment';
import EventTabTable from './eventTabTable';

interface Props {}

export default function EventDetails({}: Props) {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<number>(1);

  const { title, description_text, action, created_at, inserted_at, description } = data ?? {};

  console.log(data);

  console.log(id);

  const details = data && [
    {
      label: 'Action',
      value: action,
    },
    {
      label: 'User',
      value: description[0]?.label,
    },
    {
      label: 'Creation Date',
      value: created_at,
    },
    {
      label: 'Inserted at',
      value: inserted_at,
    },
  ];

  useEffect(() => {
    id && GET_EVENTS_BY_ID(id).then((res: any) => setData(res));
  }, [id]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Sub events',
      // @ts-ignore
      children: <EventTabTable uid={1} activeTab={activeTab} getCustomData={GET_SUB_EVENTS} title="Sub events" />,
    },
    {
      key: '2',
      label: 'Events',
      // @ts-ignore
      children: <EventTabTable uid={2} activeTab={activeTab} getCustomData={GET_SUB_EVENTS_EVENTS} title="Events" />,
    },
    {
      key: '3',
      label: 'Change Log',
      children: (
        // @ts-ignore
        <EventTabTable uid={3} activeTab={activeTab} getCustomData={GET_SUB_EVENTS_HISTORY} title="Change Log" />
      ),
    },
    {
      key: '4',
      label: 'Comments',
      children: <AddComment />,
    },
  ];

  return data ? (
    <div className="bg-white m-5 rounded-3xl !p-10">
      <div>
        <h2 className="text-xl">{title}</h2>
        <p className="mt-5">
          <span className="font-bold">Description: </span>
          <Tag>{description_text}</Tag>
        </p>
      </div>

      {/* details section */}
      <div className="flex justify-between items-center space-x-4 h-[350px] mt-10">
        <div className="w-2/3 grid grid-cols-2 gap-4 h-full">
          {details.map((el: any, index: number) => (
            <Card
              key={index}
              title={el.label}
              className="text-center"
              children={<h2 className="text-xl font-normal">{el.value}</h2>}
            />
          ))}
        </div>
        <img src="https://stat.membership.bitnata.com/event_view.png" alt="pic" className="w-1/3 rounded-3xl h-full" />
      </div>

      {/* tabs section */}
      <div className="mt-10">
        <Tabs defaultActiveKey="1" tabPosition="top" items={items} onChange={e => setActiveTab(Number(e))} />
      </div>
    </div>
  ) : (
    <div className="bg-white m-5 rounded-3xl !p-10 min-h-screen w-full flex justify-center items-center">
      <Spin className="" />
    </div>
  );
}
