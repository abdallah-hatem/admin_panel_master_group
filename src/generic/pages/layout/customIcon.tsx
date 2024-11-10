import * as Icons from '@ant-design/icons'; // Import all icons as a namespace
import { createElement, type FC } from 'react';

interface CustomIconProps {
  type: string;
}

export const CustomIcon: FC<CustomIconProps> = ({ type }) => {
  // Dynamically get the icon component by name
  const IconComponent = Icons[type as keyof typeof Icons];

  // If the icon doesn't exist, fall back to a default
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <span className="anticon">{IconComponent ? createElement(IconComponent) : <Icons.QuestionOutlined />}</span>;
};
