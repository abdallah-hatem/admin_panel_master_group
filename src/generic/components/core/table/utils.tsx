import type { TooltipProps } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';

import useModal from '@/generic/hooks/useModal';
// import { useLocale } from '@/generic/locales';
import { useLocale } from '@/locales';

type RecordType = {
  id: number;
  [key: string]: any;
};

type HandleMenuClick = (e: any, record: any, details?: any) => void;

type Action = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: HandleMenuClick;
  confirm?: boolean;
  confirmMessage?: string;
};

export type ActionColumnProps = {
  fixed?: boolean;
};

export const createTableColumns = (customColumns: any[], actions: Action[], actionColumnProps?: ActionColumnProps) => {
  const { formatMessage } = useLocale();

  const { renderModal } = useModal({});

  const renderActions = (record: RecordType) => {
    const handleMenuClick = (e: any, action: Action, record: RecordType) => {
      e.domEvent.stopPropagation();

      action?.onClick?.(e, record, action);
    };

    const menu = (
      <Menu onClick={e => e.domEvent.stopPropagation()}>
        {actions.map(action => (
          <Menu.Item key={action.key} onClick={e => handleMenuClick(e, action, record)} icon={action.icon}>
            {action.label}
          </Menu.Item>
        ))}
      </Menu>
    );

    const handleDropdownClick = (e: any) => e.stopPropagation();

    return (
      <div>
        <Dropdown trigger={['click']} overlay={menu} placement="bottomLeft" arrow>
          <Button onClick={handleDropdownClick}>
            {formatMessage({ id: 'component.actions' })} <DownOutlined />
          </Button>
        </Dropdown>

        {renderModal()}
      </div>
    );
  };

  if (actions.length > 0) {
    return [
      ...customColumns,
      {
        title: formatMessage({ id: 'general.action' }),
        key: 'action',
        // fixed: actionColumnProps?.fixed && 'right',
        fixed: 'right',
        render: (_: any, record: RecordType) => renderActions(record),
      },
    ];
  }

  return customColumns;
};

export const createTagColumn = (
  title: string,
  dataIndex: string,
  key: string,
  colorMapping?: { [key: string]: string },
  defaultColor?: string,
) => ({
  title,
  dataIndex,
  key,
  render: (values: any) => (
    <>
      {typeof values === 'string' ? (
        <Tag color={(colorMapping && colorMapping[values]) || defaultColor}>{values}</Tag>
      ) : typeof values === 'object' && !Array.isArray(values) ? (
        <Tag color={(colorMapping && colorMapping[values]) || defaultColor}>{values.name}</Tag>
      ) : (
        values.map((value: any) => (
          <Tag key={value} color={(colorMapping && colorMapping[value]) || defaultColor}>
            {value}
          </Tag>
        ))
      )}
    </>
  ),
});

interface ToolTipProps {
  toolTipProps?: TooltipProps;
  colorMapping?: { [key: string]: string };
  defaultColor?: string;
  title: string;
  dataIndex: string;
  key: string;
  render?: (record: any) => React.ReactNode;
}

export const createTooltipTagColumn = ({
  dataIndex,
  key,
  colorMapping,
  defaultColor,
  title,
  toolTipProps,
}: ToolTipProps) => ({
  title,
  dataIndex,
  key,
  toolTipProps,
  render: (record: any) => {
    const tooltip = record?.tooltip;
    const values = record?.value;

    const tooltipContent = tooltip
      ? tooltip.split('\n').map((line: string, index: number) => <div key={index}>{line}</div>)
      : null;

    const tagStyle = { margin: '2px' };

    return (
      <div>
        {values && Array.isArray(values) && values.length > 0 ? (
          values.map((tag: string, idx: number) => (
            <Tooltip
              key={idx}
              title={tooltipContent}
              style={{ backgroundColor: 'red' }}
              overlayStyle={{
                maxWidth: '600px',
                whiteSpace: 'pre-wrap',
                zIndex: 9999,
              }}
              {...toolTipProps}
            >
              <Tag color={(colorMapping && colorMapping[tag]) || defaultColor} style={tagStyle}>
                {tag}
              </Tag>
            </Tooltip>
          ))
        ) : (
          <Tooltip
            title={tooltipContent}
            overlayStyle={{
              maxWidth: '600px',
              whiteSpace: 'pre-wrap',
            }}
            {...toolTipProps}
          >
            <span>{values}</span>
          </Tooltip>
        )}
      </div>
    );
  },
});

export const createBooleanTagColumn = (
  title: string,
  dataIndex: string,
  key: string,
  trueLabel: string = 'Yes',
  falseLabel: string = 'No',
  trueColor: string = 'green',
  falseColor: string = 'red',
) => ({
  title,
  dataIndex,
  key,
  render: (value: boolean) => <Tag color={value ? trueColor : falseColor}>{value ? trueLabel : falseLabel}</Tag>,
});
