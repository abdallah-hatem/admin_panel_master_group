import type { MyPageTableOptions } from '@/generic/components/business/page';
import type { schemeType } from '@/generic/components/core/form';

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

import MyButton from '@/generic/components/basic/button';
import MyModal from '@/generic/components/basic/modal';
import TableComp from '@/generic/components/business/page';
import { createTableColumns } from '@/generic/components/core/table/utils';

import AddUpdate from './addUpdate';

interface Props {
  customColumns: MyPageTableOptions<any>;
  data?: schemeType[];
  pageParams?: object;
  title: string;
  onRowClickRoute?: string;
  onRowClick?: any;
  crudParams?: object;
  handleDataSourceChange?: any;
  dataSource: Array<object>;
  updateObjOnAction?: any;
}

export default function CrudList({
  customColumns,
  dataSource,
  title,
  data,
  handleDataSourceChange,
  pageParams,
  onRowClick,
  crudParams,
  updateObjOnAction,
}: Props) {
  const [action, setAction] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [current, setCurrent] = useState<any | null>(null);

  const triggerModal = () => {
    setCurrent(null);
    setOpened(prev => !prev);
  };

  const handleMenuClick = async (e: any, record: any) => {
    if (e.key === 'update') {
      setCurrent(record);
      record = updateObjOnAction ? updateObjOnAction(record) : record;
      setOpened(true);
    } else if (e.key === 'delete') {
      console.log(dataSource, record.index);
      handleDataSourceChange(dataSource.filter((e: any) => e?.index != record.index));
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
      confirmMessage: `Are you sure you want to archive this ${title}?`,
      onClick: handleMenuClick,
    },
  ];

  const tableColumns = createTableColumns(customColumns, actions);

  const topButtons = [
    <MyButton icon={<PlusOutlined />} onClick={triggerModal}>
      Create a new {title}
    </MyButton>,

    <MyButton icon={<ReloadOutlined />} onClick={() => setAction((prev: any) => !prev)}>
      Refresh
    </MyButton>,
  ];

  const update = async (id: number, res: any, index: number) => {
    res = updateObjOnAction ? updateObjOnAction(res) : res;

    handleDataSourceChange(dataSource.map((e: any) => (e.index == index ? { ...res, index: index } : e)));

    return true;
  };

  const add = async (res: any) => {
    res = updateObjOnAction ? updateObjOnAction(res) : res;
    handleDataSourceChange([...dataSource, { ...res, index: dataSource.length + 1 }]);

    return true;
  };

  return (
    <>
      <div className="px-5">
        <TableComp
          topButtons={topButtons}
          data={dataSource}
          onRowClick={onRowClick}
          action={action}
          pageParams={pageParams}
          tableOptions={tableColumns}
        ></TableComp>
      </div>
      <MyModal
        title={(current == null ? 'Add' : 'Update') + ' ' + title}
        open={opened}
        footer={[]}
        onCancel={triggerModal}
        width={800}
      >
        <AddUpdate
          triggerModal={triggerModal}
          setAction={setAction}
          current={current}
          UPDATE={update}
          ADD={add}
          data={data}
          param={crudParams}
        />
      </MyModal>

      {/* <MyModal
        title="Update client"
        open={openedUpdate}
        footer={[]}
        onCancel={() => {
          triggerModalUpdate();
          setCurrent(null);
        }}
        width={800}
      >
        <UpdateClient setAction={setAction} triggerModalUpdate={triggerModalUpdate} current={current} />
      </MyModal> */}
    </>
  );
}
