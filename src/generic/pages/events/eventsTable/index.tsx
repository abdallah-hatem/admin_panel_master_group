import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Badge, Form } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { GET_EVENTS_ACTIONS } from '@/generic/api/events';
import MyButton from '@/generic/components/basic/button';
import DrawerComp from '@/generic/components/basic/drawerComp';
import TableComp from '@/generic/components/business/page';
import { createTableColumns } from '@/generic/components/core/table/utils';
import { formatDateObj } from '@/generic/helpers/date';
import { parseRichText } from '@/generic/utils/tools';

import FilterForm from './filterForm';

// type ActivityRecord = {
//   id: number;
//   title: string;
//   _type: string;
//   includes_hotel_pickup: boolean;
//   category: { name: string };
// };

interface Props {
  customComps?: any;
  data: any;
  getAllData?: (params?: object) => void;
  getEventsData?: (params?: object) => void;
}

export default function EventsTable({ customComps, data, getAllData, getEventsData }: Props) {
  const [form] = Form.useForm();
  const router = useNavigate();

  console.log(data);

  const { count, page, per_page } = useSelector((state: any) => state.fetch);

  const [numOfFilters, setNumOfFilters] = useState<number>(0);
  const [actions, setActions] = useState<any>(null);

  const getActions = () => GET_EVENTS_ACTIONS().then((res: any) => setActions(res));

  useEffect(() => {
    getActions();
  }, []);

  function onFilterSubmit(value: any) {
    console.log(value);

    const { date, actions, user_ids, ...rest } = value;

    function countNonNullProperties(obj: any) {
      return Object.keys(obj).filter(key => obj[key] !== null && obj[key] !== undefined).length;
    }

    const removeUndefined = (obj: any) => {
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== ''));
    };

    setNumOfFilters(countNonNullProperties(value));

    const val = {
      from_date: date && formatDateObj(date[0]),
      to_date: date && formatDateObj(date[1]),
      actions: actions && actions.join(','),
      user_ids: user_ids && user_ids.join(','),
      ...rest,
    };

    const cleanedData = removeUndefined(val);

    console.log(cleanedData, 'cleanedData');

    getAllData && getAllData(cleanedData);
  }

  const topButtons = [
    <DrawerComp
      title="Filter"
      onClear={() => form.resetFields()}
      onSubmit={() => form.submit()}
      children={<FilterForm form={form} onFilterSubmit={onFilterSubmit} />}
      trigger={
        <Badge className="mr-5 my-3" count={numOfFilters}>
          <MyButton icon={<FilterOutlined />}>Filters</MyButton>
        </Badge>
      }
    />,
    <MyButton className="my-3" icon={<ReloadOutlined />} onClick={() => getEventsData && getEventsData()}>
      Refresh
    </MyButton>,
  ];

  // Data de criação	Ação	Descrição	Etiquetas	Observação
  const customColumns = [
    { title: 'Inserted at', dataIndex: 'inserted_at', key: 'inserted_at', width: 120 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 120 },
    // Todo rich text component
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (values: any) => parseRichText(values),
    },

    // createTagColumn('Tags', 'tags', 'tags'),
  ];

  const tableColumns = createTableColumns(customColumns, []);

  return (
    <TableComp
      // loading={!data}
      topButtons={topButtons}
      customComponents={customComps}
      tableStyleTw="max-w-[99%] mx-auto"
      data={data}
      tableOptions={tableColumns}
      onRowClick={(row: any) => router(`/admin/event/${row.id}`)}
      pagination={{
        pageSize: per_page,
        current: page,
        total: count,
        showQuickJumper: false,
        onChange(page, pageSize) {
          getEventsData && getEventsData({ page, per_page: pageSize });
        },
      }}
    />
  );
}
