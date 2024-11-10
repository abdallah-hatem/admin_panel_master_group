import type { TooltipProps } from 'antd';

import { Tag, Tooltip } from 'antd';

interface Props {
  value?: any;
  tooltip?: any;
  toolTipProps?: TooltipProps;
  colorMapping?: { [key: string]: string };
  defaultColor?: string;
  title?: string;
  dataIndex?: string;
  key?: string;
}

export default function ToolTipColumn({ value, tooltip, toolTipProps, colorMapping, defaultColor }: Props) {
  console.log(value);

  const tooltipContent = tooltip
    ? tooltip.split('\n').map((line: string, index: number) => <div key={index}>{line}</div>)
    : null;

  const tagStyle = { margin: '2px' };

  // return <Tooltip title={tooltip}>{value.map((el: any) => el).join(', ')}</Tooltip>;

  return (
    <div>
      {value && Array.isArray(value) && value.length > 0 ? (
        value.map((tag: string, idx: number) => (
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
          <span>{value}</span>
        </Tooltip>
      )}
    </div>
  );
}
