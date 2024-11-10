import type { FC } from 'react';

import { TreeSelect } from 'antd';

const BaseTreeSelect: FC = ({ children: _, ...props }: any) => {
  return <TreeSelect {...props} />;
};

const MyTreeSelect = Object.assign(TreeSelect, BaseTreeSelect);

export default MyTreeSelect;
