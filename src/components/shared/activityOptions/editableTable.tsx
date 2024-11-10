import type { GetRef, InputRef, TableProps } from 'antd';

import { Button, Form, Input, Popconfirm, Popover, Table } from 'antd';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';

import { getRandomNumber } from '@/generic/helpers/genral';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{ required: true, message: `${title} is required.` }]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
}

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

interface Props {
  dataSource?: DataType[];
  onChange?: (data: any) => void;
  clientTypes?: any[];
  form?: any;
  modifierName?: any;
  optionIndex?: any;
  priceIndex?: any;
  field?: any;
}

const EditableTable = ({ dataSource: _dataSource, onChange, clientTypes, form, field }: Props) => {
  function initialVal() {
    console.log(field);
    console.log(form.getFieldsValue(true));

    const fieldPath = ['schedule_prices', field[0], 'client_types_table'];

    // Accessing client_types data
    const clientTypes = form.getFieldValue(fieldPath);

    console.log(clientTypes);

    if (clientTypes) return clientTypes;

    return [];
  }

  const [dataSource, setDataSource] = useState<DataType[]>(initialVal());

  useEffect(() => {
    if (dataSource) {
      const fieldPath = ['schedule_prices', field[0], 'client_types_table'];

      form.setFieldValue(fieldPath, dataSource);
    }
  }, [dataSource]);

  const handleDelete = (client_type: any) => {
    setDataSource(dataSource.filter((el: any) => el.client_type !== client_type));
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Client Type',
      dataIndex: 'client_type',
      width: '30%',
    },
    {
      title: 'Min Age',
      dataIndex: 'minimum_age',
      editable: true,
      width: '30%',
    },
    {
      title: 'Max Age',
      dataIndex: 'maximum_age',
      editable: true,
      width: '30%',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_: any, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record?.client_type)}>
            <p className="text-red-500 cursor-pointer">Delete</p>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const addRow = ({ id }: { id: string }) => {
    const newData: any = {
      key: getRandomNumber(),
      // id,
      client_type: id,
      minimum_age: 1,
      maximum_age: 1,
    };

    if (dataSource.length === 0) return setDataSource([newData]);

    setDataSource(prev => [...prev, newData]);
  };

  const content = (
    <div className="grid grid-cols-3 gap-3">
      {clientTypes?.map((el: any) => (
        <Button
          type="text"
          key={el.id}
          disabled={dataSource?.filter((el2: any) => el2.client_type === el?.id && el2.minimum_age > 0).length > 0}
          className="cursor-pointer"
          onClick={() => {
            addRow({ id: el.id });
          }}
        >
          {el.suggestion}
        </Button>
      ))}
    </div>
  );

  return (
    <div>
      <Popover content={content} title="Age types" placement="topLeft">
        <Button onClick={() => ''} className="mb-3 float-right">
          Add Row
        </Button>
      </Popover>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource?.filter((el: any) => el.minimum_age !== 0)}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default memo(EditableTable);
