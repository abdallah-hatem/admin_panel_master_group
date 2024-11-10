import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import CrudTable from '@/generic/components/crudTable';
import { setDefValue } from '@/generic/stores/form.store';
import { useLocale } from '@/locales';

import { useAddForm } from '../updateItinerary/forms/add';
import { useColumns } from './forms/columns';

interface Props {
  data: any[];
  setMarkers?: (data: any) => void;
  setCenter: (data: any) => void;
}

export default function ItineraryTable({ data, setMarkers, setCenter }: Props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { formatMessage } = useLocale();

  const [selectedRowId, setSelectedRowId] = useState<number | string>(0);

  const [arrangedData, setArrangedData] = useState<any>(null);

  console.log(data);

  console.log(arrangedData);

  useEffect(() => {
    if (data) {
      // # get last record
      // const lastRecord = data[data.length - 1];

      // if (addedRow.includes(lastRecord?.id)) return;

      // // setRowDetails(lastRecord);
      // setCenter(lastRecord);
      // setAddedRow((prev: any) => [...prev, lastRecord?.id]);
      // order the data by the order property
      // data = data.sort((a, b) => a.order - b.order);

      setArrangedData(data);
    }
  }, [data]);

  const customColumns = useColumns({});

  const updateFormData = useAddForm({ formRef: form });

  const onEditSubmit = (value: any) => {
    const filteredMarkers = arrangedData?.map((el: any) => {
      if (`${el?.lat}-${el?.lng}` === `${value?.lat}-${value?.lng}`) {
        return (el = value);
      } else {
        return el;
      }
    });

    setArrangedData(filteredMarkers);

    console.log(filteredMarkers);

    setMarkers && setMarkers(filteredMarkers);
  };

  const handleOnDragEnd = (e: any) => {
    setArrangedData(e);

    setMarkers && setMarkers(e);
  };

  return (
    <CrudTable
      title="Itinerary"
      isDraggable={true}
      onDragFinish={handleOnDragEnd}
      tableCompData={arrangedData?.map((el: any) => ({ ...el, key: `${el?.lat}-${el?.lng}` }))}
      showTopButtons={false}
      customColumns={customColumns}
      data={updateFormData}
      formProps={{ layout: 'vertical' }}
      tableProps={{ rowClassName: (record: any) => (record.id === selectedRowId ? 'clicked-row' : 'normal-row') }}
      customOnFinish={e => onEditSubmit(e)}
      formRef={form}
      onUpdateModalOpen={e => dispatch(setDefValue(e?.duration_unit))}
      onRowClick={(row: any) => {
        console.log(row, 'row');

        setSelectedRowId(row.id);
        setCenter(row);
      }}
      deleteFunction={record =>
        setMarkers && setMarkers((prev: any) => prev.filter((el: any) => `${el?.lat}-${el?.lng}` !== record.key))
      }
    />
  );
}
