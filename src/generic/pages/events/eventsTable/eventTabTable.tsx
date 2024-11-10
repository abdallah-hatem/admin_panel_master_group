import type { MyResponse } from '@/generic/api/request';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import TableComp from '@/generic/components/business/page';
import MyFormItem from '@/generic/components/core/form-item';
import { createTableColumns } from '@/generic/components/core/table/utils';
import { formatDateObj } from '@/generic/helpers/date';
import { parseRichText } from '@/generic/utils/tools';
import { setFetchState } from '@/generic/stores/fetch.store';

interface Props {
  title: string;
  getCustomData?: (id: string | number, params?: object) => MyResponse<any>;
  activeTab: number;
  uid: number;
}

export default function EventTabTable({ title, getCustomData, activeTab, uid }: Props) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { count, page, per_page } = useSelector((state: any) => state.fetch);

  const [data, setData] = useState<any>(null);

  function getData(params?: any) {
    const base = {
      page: page,
      per_page: per_page,
    };

    const _params = params
      ? {
          ...base,
          ...params,
        }
      : base;

    console.log(_params);

    id &&
      getCustomData &&
      getCustomData(id, _params).then((res: any) => {
        console.log(res);

        setData(res.result);
        dispatch(setFetchState(res.pagination));
      });
  }

  useEffect(() => {
    if (activeTab === uid) getData();
  }, [activeTab]);

  function handleFilterChange(value: any) {
    console.log(value);

    const val = {
      from_date: formatDateObj(value[0]),
      to_date: formatDateObj(value[1]),
    };

    console.log(val);
    getData && getData(val);
  }

  const customColumns = [
    { title: 'Creation Date', dataIndex: 'inserted_at', key: 'inserted_at' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    // createTagColumn('Tags', 'tags', 'tags'),
    // Todo rich text component
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (values: any) => parseRichText(values),
    },
    { title: 'Observation', dataIndex: 'observation', key: 'observation' },
  ];

  const logColumns = [
    { title: 'ID', dataIndex: 'id', key: 'inserted_at' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (values: any) => parseRichText(values),
    },
    { title: 'Inserted at', dataIndex: 'inserted_at', key: 'inserted_at' },
  ];

  const customComps = (
    <div className="flex justify-between items-center mb-5 mt-10">
      <h2 className="text-2xl">{title}</h2>
      <MyFormItem
        type="range-date-picker"
        name="date"
        className="mb-0"
        innerProps={{
          onChange: (e: any) => handleFilterChange(e),
        }}
      />
    </div>
  );

  const tableColumns = createTableColumns(uid === 3 ? logColumns : customColumns, []);

  return (
    <TableComp
      customComponents={customComps}
      data={data}
      tableOptions={tableColumns}
      pagination={{
        pageSize: per_page,
        current: page,
        total: count,
        showQuickJumper: false,
        onChange(page, pageSize) {
          getData && getData({ page, per_page: pageSize });
        },
      }}
    />
  );
}
