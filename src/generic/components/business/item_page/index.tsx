/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ModalProps, TabsProps } from 'antd';

import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Tabs } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Comments from '@/generic/components/business/comments';
import AddUpdate from '@/generic/components/crudTable/addUpdate';
import useFetch from '@/generic/hooks/useFetch';
import useModal from '@/generic/hooks/useModal';

import CardComp from '../../basic/cardComp';

interface Detail {
  label: string;
  value: string | number | null;
}

interface ItemPageProps {
  fetchItemById: any;
  fetchParams?: any;
  detailsConfig: (data: any) => Detail[];
  tabsConfig?: TabsProps['items'];
  updateItem: any;
  formData?: any;
  modalProps?: ModalProps;
}

export default function ItemPage({
  fetchItemById,
  detailsConfig,
  tabsConfig,
  updateItem,
  formData,
  fetchParams,
  modalProps,
}: ItemPageProps) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<number>(1);

  const { showModal, renderModal, hideModal } = useModal({ modalProps: { footer: null } });

  const { data: itemData, refetch } = useFetch<any>({
    GET: fetchItemById,
    params: { id: String(id), ...fetchParams },
    dependencies: [id],
  });

  const details = itemData ? detailsConfig(itemData) : [];

  const handleEdit = () => {
    return showModal(
      <AddUpdate
        triggerModal={hideModal}
        current={itemData}
        UPDATE={updateItem}
        afterOnFinish={refetch}
        data={formData}
      />,
      1200,
      { footer: null, ...modalProps },
    );
  };

  const defaultTabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Details',
      children: (
        <div className="flex flex-wrap justify-between items-center space-x-4 h-auto mt-10">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((el, index) => (
              <Card key={index} title={el.label} className="text-center">
                <h2 className="text-xl font-normal">{el.value || 'N/A'}</h2>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Comments',
      children: <Comments />,
    },
  ];

  const tabs = tabsConfig || defaultTabs;

  return itemData ? (
    <div className="">
      <CardComp styleTw="w-[97%]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">{itemData.title}</h2>
          <Button icon={<EditOutlined />} onClick={handleEdit} />
        </div>

        {/* details section */}
        <div className="flex flex-wrap justify-between items-center space-x-4 h-auto mt-10">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((el, index) => (
              <Card key={index} title={el.label} className="text-center">
                {typeof el?.value === 'string' && el?.value?.startsWith('http') ? (
                  <Link className="text-xl font-normal text-blue-500" target="_blank" to={el.value}>
                    Link
                  </Link>
                ) : (
                  <h2 className="text-xl font-normal break-words">{el.value || 'N/A'}</h2>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* tabs section */}
        <div className="mt-10">
          <Tabs defaultActiveKey="1" tabPosition="top" items={tabs} onChange={e => setActiveTab(Number(e))} />
        </div>
      </CardComp>

      {renderModal()}
    </div>
  ) : (
    <div className="bg-white m-5 rounded-3xl p-5 sm:p-10 min-h-screen w-full flex justify-center items-center">
      <Spin className="" />
    </div>
  );
}
