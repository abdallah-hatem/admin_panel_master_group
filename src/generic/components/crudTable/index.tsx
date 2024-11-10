import type { MyPageTableOptions } from '@/generic/components/business/page';
import type { schemeType } from '@/generic/components/core/form';
import type { ActionColumnProps } from '@/generic/components/core/table/utils';
import type { FormProps as JSFormProps } from '@rjsf/core';
import type { FormProps, ModalProps, TableProps } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { DeleteOutlined, EditOutlined, FilterOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Badge, message, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyButton from '@/generic/components/basic/button';
import TableComp from '@/generic/components/business/page';
import { createTableColumns } from '@/generic/components/core/table/utils';
import { formatJsonFormColumns, removeKeysFromSchema, transformSchemaToColumns } from '@/generic/helpers/jsonForm';
import useFetch from '@/generic/hooks/useFetch';
import useModal from '@/generic/hooks/useModal';
import { dispatch } from '@/generic/stores';
import { setCreateButtonClickCountPlusOne } from '@/generic/stores/form.store';

import DrawerComp from '../basic/drawerComp';
import AddUpdate from './addUpdate';
import JsonFormComp from './jsonFormComp';

export interface CrudTableProps {
  UPDATE?: any;
  ADD?: any;
  ARCHIVE?: any;
  GET?: any;
  customColumns?: MyPageTableOptions<any>;
  data?: schemeType[];
  updateData?: schemeType[];
  pageParams?: object;
  title: string;
  onRowClickRoute?: string;
  onRowClick?: any;
  crudParams?: object;
  onEditRoute?: string;
  modalProps?: ModalProps;

  formProps?: FormProps;
  showTopButtons?: boolean;
  tableStyleTw?: string;
  hideActions?: boolean;
  formRef?: any;
  submitStyleTw?: string;
  onSuccess?: () => void;
  onFinish?: (data?: any) => void;
  onSumbit?: (data?: any) => void;
  hideCreateButton?: boolean;
  showFilterButton?: boolean;
  addActions?: any[];
  hideEditActionButton?: boolean;
  onRefresh?: () => void;
  onDataFetch?: (data?: any) => void;
  tableCompData?: any;
  AddId?: number | string;
  GET_ID?: number | string;
  addToUpdateParams?: any;
  deleteParams?: any;
  onUpdateModalOpen?: (data?: any) => void;
  tableProps?: TableProps;
  deleteFunction?: (data?: any) => void;
  customOnFinish?: (data?: any) => void;
  isDraggable?: boolean;
  onDragFinish?: (data?: any) => void;
  afterOnFinish?: (data?: any) => void;
  showInCreateModal?: ReactNode;
  showInUpdateModal?: ReactNode;
  jsFormProps?: JSFormProps;
  getJsonFormDataAdd?: any;
  getJsonFormDataAddParams?: any;
  getJsonFormDataUpdateParams?: any;
  getJsonFormDataUpdate?: any;
  getJsonFormColumnsAndFilters?: any;
  queryFieldsToRemove?: string[];
  modalDependencies?: any[];
  getJsonFormColumnsAndFiltersParams?: any;
  dependencies?: any[];
  tableType?: 'default' | 'raw';
  actionColumnProps?: ActionColumnProps;
  addTopButtons?: any[];
  modalContentStyleTw?: string;
  deleteActionLabel?: string;
  createButtonTitle?: string;
  refreshButtonTitle?: string;
  FilterButtonTitle?: string;
}

export default function CrudTable({
  customColumns,
  UPDATE,
  ADD,
  ARCHIVE,
  GET,
  title,
  data,
  updateData,
  pageParams,
  onRowClickRoute,
  onRowClick,
  crudParams,
  onEditRoute,
  modalProps,
  formProps,
  showTopButtons = true,
  tableStyleTw,
  hideActions = false,
  formRef,
  submitStyleTw,
  onSuccess,
  onFinish,
  onSumbit,
  hideCreateButton = false,
  showFilterButton = false,
  addActions,
  hideEditActionButton = false,
  onRefresh,
  onDataFetch,
  tableCompData,
  AddId,
  GET_ID,
  addToUpdateParams,
  deleteParams,
  onUpdateModalOpen,
  tableProps,
  deleteFunction,
  customOnFinish,
  isDraggable,
  onDragFinish,
  showInCreateModal,
  showInUpdateModal,
  jsFormProps,
  getJsonFormDataAdd,
  getJsonFormDataUpdate,
  getJsonFormColumnsAndFilters,
  queryFieldsToRemove = [],
  modalDependencies = [],
  getJsonFormDataAddParams,
  getJsonFormDataUpdateParams,
  getJsonFormColumnsAndFiltersParams,
  afterOnFinish,
  dependencies,
  tableType = 'default',
  actionColumnProps,
  addTopButtons = [],
  modalContentStyleTw,
  deleteActionLabel = 'Archive',
  createButtonTitle,
  refreshButtonTitle = 'Refresh',
  FilterButtonTitle = 'Filter',
}: CrudTableProps) {
  const router: NavigateFunction = useNavigate();
  const { showModal, renderModal, hideModal } = useModal({ onHide: onModalHide, modalProps: {} });

  const [action, setAction] = useState<boolean>(false);
  const [current, setCurrent] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [numOfFilters, setNumOfFilters] = useState<number>(0);

  console.log(data);

  function onModalHide() {
    setCurrent(null);
    setModalVisible(false);
  }

  useEffect(() => {
    if (current || modalVisible) {
      if (showInCreateModal && !current) return showModal(showInCreateModal);

      if (showInUpdateModal && current) return showModal(showInUpdateModal);

      if (current?.type === 'delete')
        return showModal(
          <></>,
          500,
          {
            title: current?.details?.confirmMessage || 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: e => {
              e && e.stopPropagation();
              delFunction(current?.id);
              hideModal();
            },
          },
          'bg-red-transparent',
        );

      showModal(
        <AddUpdate
          triggerModal={hideModal}
          setAction={setAction}
          current={current}
          UPDATE={UPDATE}
          ADD={ADD}
          data={data}
          updateData={updateData}
          param={crudParams}
          formProps={formProps}
          formRef={formRef}
          submitStyleTw={submitStyleTw}
          onSuccess={onSuccess}
          onFinish={onFinish}
          onSumbit={onSumbit}
          AddId={AddId}
          addToUpdateParams={addToUpdateParams}
          onUpdateModalOpen={onUpdateModalOpen}
          customOnFinish={customOnFinish}
          afterOnFinish={afterOnFinish}
          jsFormProps={jsFormProps}
          getJsonFormDataAdd={getJsonFormDataAdd}
          getJsonFormDataAddParams={getJsonFormDataAddParams}
          getJsonFormDataUpdate={getJsonFormDataUpdate}
          getJsonFormDataUpdateParams={getJsonFormDataUpdateParams}
        />,
        1200,
        { footer: null, ...modalProps, styles: { content: { maxHeight: '85vh', overflowY: 'scroll' } } },
        modalContentStyleTw,
      );
    }
  }, [current, formProps, data, modalVisible, ...modalDependencies, modalContentStyleTw]);

  function delFunction(id: string | number) {
    if (deleteParams) {
      return ARCHIVE({ instanceId: id, ...deleteParams })
        .then((res: any) => {
          setAction(prev => !prev);
          if (res[1] === 204 || res.status === 200) return message.success('Deleted successfully');
        })
        .catch((e: any) => {
          console.log(e);
        });
    }

    ARCHIVE(id)
      .then((res: any) => {
        setAction(prev => !prev);
        if (res[1] === 204 || res.status === 200) return message.success('Deleted successfully');
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  const handleMenuClick = async (e: any, record: any, details?: any) => {
    console.log(e, 'eeeee');
    console.log(record, 'reccc');
    console.log(details, 'details');

    if (e.key === 'update') {
      if (onEditRoute) {
        router(`/${onEditRoute}/edit/${record.id}`);
      } else {
        console.log(record);

        setCurrent(record);
      }
    }

    if (e.key === 'delete') {
      if (deleteFunction) return deleteFunction(record);

      setCurrent({ ...record, type: 'delete', details });
    }
  };

  const actions = [
    {
      key: 'update',
      label: 'Update',
      icon: <EditOutlined />,
      onClick: handleMenuClick,
    },
    ...(addActions ?? []),
    {
      key: 'delete',
      label: deleteActionLabel,
      icon: <DeleteOutlined />,
      confirm: true,
      confirmMessage: `Are you sure you want to archive this ${title}?`,
      onClick: handleMenuClick,
    },
  ];

  function getActions(actions: any[]) {
    const _actions = [...actions];

    if (hideActions) return [];

    if (hideEditActionButton) return _actions.filter((el: any) => el.key !== 'update');

    return _actions;
  }

  const { data: cols } = useFetch<any>({
    GET: getJsonFormColumnsAndFilters ?? undefined,
    params: getJsonFormColumnsAndFiltersParams,
    defaultValue: null,
  });

  const cleanedQueryFields =
    cols &&
    removeKeysFromSchema(cols?.query_schema, [...queryFieldsToRemove, 'order_by', 'ascending', 'page', 'per_page']);

  const tableColumns = useCallback(() => {
    return createTableColumns(
      cols ? formatJsonFormColumns(cols.response_schema) : (customColumns ?? []),
      getActions(actions),
      actionColumnProps,
    );
  }, [cols, actions]);

  const renderCreateModal = () => setModalVisible(true);

  const topButtons = [
    !hideCreateButton && (
      <MyButton
        icon={<PlusOutlined />}
        onClick={() => {
          dispatch(setCreateButtonClickCountPlusOne());
          renderCreateModal();
        }}
      >
        {createButtonTitle ?? `Create a new ${title}`}
      </MyButton>
    ),

    ...addTopButtons,

    showFilterButton && (
      <DrawerComp
        title="Filter"
        hideButtons
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        children={<JsonFormComp jsFormProps={{ schema: cleanedQueryFields }} onFinish={e => console.log(e)} />}
        trigger={
          <Badge className="mx-5" count={numOfFilters}>
            <MyButton icon={<FilterOutlined />}>{FilterButtonTitle}</MyButton>
          </Badge>
        }
      />
    ),

    <MyButton
      icon={<ReloadOutlined />}
      onClick={() => {
        setAction((prev: any) => !prev);
        onRefresh?.();
      }}
    >
      {refreshButtonTitle}
    </MyButton>,
  ];

  if (tableType === 'raw') {
    return (
      <>
        <Table columns={tableColumns()} dataSource={!GET && tableCompData} {...tableProps} />

        {renderModal()}
      </>
    );
  }

  return (
    <>
      <div className="px-5">
        <TableComp
          isDraggable={isDraggable}
          onDragFinish={onDragFinish}
          topButtons={showTopButtons ? topButtons : []}
          pageApi={GET}
          onRowClick={onRowClickRoute ? (record: any) => router(`/${onRowClickRoute}/${record.id}`) : onRowClick}
          action={action}
          pageParams={pageParams}
          tableOptions={tableColumns()}
          tableStyleTw={tableStyleTw}
          onDataFetch={onDataFetch}
          data={!GET && tableCompData}
          GET_ID={GET_ID}
          tableProps={tableProps}
          dependencies={dependencies}
        />
      </div>

      {renderModal()}
    </>
  );
}
