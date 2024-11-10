import type { MyPageTableOptions } from '@/generic/components/business/page';
import type { ActivityDto } from '@/interface/activities';
import type { PackageItemDto } from '@/interface/packageItem';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, message, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';

import { GET_ACTIVITIES, GET_ACTIVITIES_MY } from '@/api/activities';
import { GET_ACTIVITY_SCHEDULE_ITEM } from '@/api/packageItems';
import { ADD_ACTIVITY_SCHEDULES } from '@/api/packages';
import MyButton from '@/generic/components/basic/button';
import MyModal from '@/generic/components/basic/modal';
import TableComp from '@/generic/components/business/page';
import MyForm from '@/generic/components/core/form';

import AddPackageItem from '../packageItems/addPackageItems';
import AddPrices from './addPrices';

interface Props {
  next: () => void;
}

export default function MainPackageDetails({ next }: Props) {
  const [form] = Form.useForm();

  const [packageItems, setPackageItems] = useState<PackageItemDto[] | null>(null);
  const [activities, setActivities] = useState<ActivityDto[] | null>(null);
  const [opened, setOpened] = useState<boolean>(false);
  const [priceopened, setPriceOpened] = useState<boolean>(false);
  const [prices, setPrices] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [action, setAction] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [collapseItems, setCollapseItems] = useState<boolean>(false);

  console.log(prices, 'prices');
  console.log(items, 'items');

  useEffect(() => {
    GET_ACTIVITY_SCHEDULE_ITEM().then((res: any) => setPackageItems(res));
    GET_ACTIVITIES_MY().then((res: any) => setActivities(res));
  }, []);

  const triggerModal = () => setOpened(prev => !prev);
  const triggerModalPrice = () => setPriceOpened(prev => !prev);

  const onFinish = (value: any) => {
    const { activity_id, date, description, title } = value;

    const val = {
      activity_id,
      date,
      description,
      title,
      items: items.map(el => {
        return { activity_schedule_item_id: el.activity_item_id, included: el.included };
      }),
      schedule_prices: prices.map(el => {
        delete el.client_type;

        return el;
      }),
      // itineraries: [
      //   {
      //     title: '3433dd',
      //     latitude: 38.7047264878939,
      //     longitude: -8.523233092467487,
      //     description: 'dsds',
      //     _type: 'van',
      //     duration: 33,
      //     duration_unit: 'hours',
      //     day: 1,
      //     order: 1
      //   },
      // ],
      _type: 'base',
    };

    console.log(val);

    // ADD_ACTIVITY_SCHEDULES(val).then(() => {
    //   message.success('Added successfully');
    //   //   form.resetFields();
    // });

    // next();
  };

  const onItemFinish = (value: any) => {
    console.log(value);
    setItems(value.items_ids);
  };

  const removeByAgeRangeId = (id: number | string) => {
    const newPrices = prices.filter(el => el.clients_age_ranges_id !== id);

    setPrices(newPrices);
  };

  const getItems = () => {
    const resultArray = items?.map(item2 => {
      const match = packageItems?.find((item1: any) => item1.id === item2.activity_item_id);

      if (match) {
        return { ...item2, title: match.title };
      } else {
        return item2;
      }
    });

    return resultArray;
  };

  const tableColumsItems: MyPageTableOptions<any> = [
    { title: 'Item name', dataIndex: 'title', key: 'id', width: 200 },
    {
      title: 'Included',
      dataIndex: 'included',
      key: 'id',
      width: 200,
      render: el => (el ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <MyButton
            type="text"
            onClick={() => {
              console.log(record, 'record');

              const newItems = getItems().map((el: any) => {
                if (el.activity_item_id === record.activity_item_id) {
                  return { ...record, included: !record.included };
                } else {
                  return el;
                }
              });

              setItems(newItems);

              //   removeByAgeRangeId(record.clients_age_ranges_id);
            }}
            style={{ color: 'blue' }}
          >
            Switch
          </MyButton>
        </Space>
      ),
    },
  ];

  const tableColums: MyPageTableOptions<any> = [
    { title: 'Client type', dataIndex: 'client_type', key: 'id', width: 200 },
    { title: 'Minimum participants', dataIndex: 'minimum_participants', key: 'id', width: 200 },
    { title: 'Maximum participants', dataIndex: 'maximum_participants', key: 'id', width: 200 },
    { title: 'Price', dataIndex: 'price', key: 'id', width: 200 },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <MyButton
            type="text"
            onClick={() => {
              removeByAgeRangeId(record.clients_age_ranges_id);
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
    <MyForm<any> onFinish={onFinish} form={form} layout="horizontal" labelCol={{ span: 3 }} labelAlign="left">
      <MyForm.Item label="Package title" required name="title" type="input" />
      <MyForm.Item label="Description" name="description" type="input" />
      <MyForm.Item label="Date" required name="date" type="date-picker" />
      <MyForm.Item
        label="Activities"
        required
        name="activity_id"
        type="select"
        options={activities?.map(item => ({ label: item.title, value: item.id }))}
      />

      {/* Items */}
      <div className={items.length > 0 ? `border border-blue-300 p-5 rounded-2xl` : ''}>
        <div className="flex items-center justify-between mb-10 w-full">
          <MyForm.Item
            label="Package items"
            required
            name="items_ids"
            type="select"
            options={packageItems?.map(item => ({ label: item.title, value: item.id }))}
            innerProps={{
              mode: 'multiple',
              onChange: (value: any) => {
                setItems(
                  value.map((el: any) => {
                    return { activity_item_id: el, included: false };
                  }),
                );
              },
            }}
            className="self-center m-0 w-full"
          />
          <Button className="flex items-center ml-2" onClick={triggerModal}>
            <PlusOutlined />
          </Button>
          {items.length > 0 && (
            <Button onClick={() => setCollapseItems(prev => !prev)}>{collapseItems ? 'Expand' : 'Collapse'}</Button>
          )}
        </div>
        {items.length > 0 && !collapseItems && (
          <TableComp
            // pageApi={GET_ACTIVITY_SCHEDULES}
            // onRowClick={(record: any) => router(`/categories/updateCategory/${record.id}`)}
            tableOptions={tableColumsItems}
            data={getItems()}
            action={action}
          ></TableComp>
        )}
      </div>

      {/* Prices */}
      <div className={prices.length > 0 ? `border border-blue-300 p-5 rounded-2xl mt-10` : ''}>
        <div className="flex items-center justify-between mb-10 w-full">
          <MyForm.Item label="Prices" name="ages" className="self-center m-0 w-full">
            <Button className="flex items-center " onClick={triggerModalPrice}>
              <PlusOutlined />
            </Button>
          </MyForm.Item>
          {prices.length > 0 && (
            <Button onClick={() => setCollapse(prev => !prev)}>{collapse ? 'Expand' : 'Collapse'}</Button>
          )}
        </div>

        {prices.length > 0 && !collapse && (
          <TableComp
            // pageApi={GET_ACTIVITY_SCHEDULES}
            // onRowClick={(record: any) => router(`/categories/updateCategory/${record.id}`)}
            tableOptions={tableColums}
            data={prices}
            action={action}
          ></TableComp>
        )}
      </div>

      {/* Modal item */}
      <MyModal title="Create item" open={opened} footer={[]} onCancel={triggerModal}>
        <AddPackageItem onSuccess={() => GET_ACTIVITY_SCHEDULE_ITEM().then((res: any) => setPackageItems(res))} />
      </MyModal>

      {/* Modal prices */}
      <MyModal title="Create price" open={priceopened} footer={[]} onCancel={triggerModalPrice}>
        {/* <AddPrices setPrices={setPrices} setAction={setAction} /> */}
      </MyModal>

      {/* submit button */}
      <MyForm.Item className="float-right mt-10 pb-10">
        <MyButton type="primary" htmlType="submit" onClick={() => next()}>
          Submit
        </MyButton>
      </MyForm.Item>
    </MyForm>
  );
}
