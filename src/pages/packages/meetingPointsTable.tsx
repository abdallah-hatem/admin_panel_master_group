import type { MyPageTableOptions } from '@/generic/components/business/page';
import type { schemeType } from '@/generic/components/core/form';

import { useEffect, useState } from 'react';

import CrudTable from '@/generic/components/crudTable';
import { useLocale } from '@/locales';

interface Props {
  data: any[];
  setMarkers?: (data: any) => void;
  setCenter: (data: any) => void;
}

export default function MeetingPointsTable({ data, setMarkers, setCenter }: Props) {
  const [selectedRowId, setSelectedRowId] = useState<number | string>(0);

  const { formatMessage } = useLocale();

  console.log(data);

  const tableColumsItems: MyPageTableOptions<any> = [
    { title: formatMessage({ id: 'general.name' }), dataIndex: 'name', key: 'id', width: 60 },
    { title: formatMessage({ id: 'general.latitude' }), dataIndex: 'lat', key: 'id', width: 200 },
    { title: formatMessage({ id: 'general.longitude' }), dataIndex: 'lng', key: 'id', width: 200 },
  ];

  const updateFormData: schemeType[] = [
    [
      { label: formatMessage({ id: 'general.name' }), type: 'input', name: 'name', required: true },
      { label: formatMessage({ id: 'general.latitude' }), type: 'input', name: 'lat', innerProps: { disabled: true } },
      { label: formatMessage({ id: 'general.longitude' }), type: 'input', name: 'lng', innerProps: { disabled: true } },
    ],
  ];

  const onEditSubmit = (value: any) => {
    const filteredMarkers = data?.map((el: any) => {
      if (`${el?.lat}-${el?.lng}` === `${value?.lat}-${value?.lng}`) {
        return (el = value);
      } else {
        return el;
      }
    });

    setMarkers && setMarkers(filteredMarkers);
  };

  return (
    <CrudTable
      title={formatMessage({ id: 'general.meeting_points' })}
      tableCompData={data?.map((el: any) => ({ ...el, key: `${el?.lat}-${el?.lng}` }))}
      showTopButtons={false}
      customColumns={tableColumsItems}
      data={updateFormData}
      formProps={{ layout: 'vertical' }}
      onRowClick={(row: any) => {
        console.log(row, 'row');
        setSelectedRowId(row.id);
        // delete row.id;
        setCenter(row);
      }}
      tableProps={{ rowClassName: (record: any) => (record.id === selectedRowId ? 'clicked-row' : 'normal-row') }}
      deleteFunction={record =>
        setMarkers && setMarkers((prev: any) => prev.filter((el: any) => `${el?.lat}-${el?.lng}` !== record.key))
      }
      customOnFinish={(e: any) => onEditSubmit(e)}
      tableStyleTw="max-w-[99%] mx-auto"
    />
  );
}
