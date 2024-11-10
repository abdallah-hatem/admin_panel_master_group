import type { DragEndEvent } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { TableColumnsType, TableProps } from 'antd';

import { HolderOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/react';
import { Button, Table } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import TableColumn from '../table-column';

interface MyTableProps<T extends object> extends TableProps<T> {
  height?: string;
  isDraggable?: boolean;
  onDragFinish?: (data: any) => void;
}

const MyTable = <T extends object = object>(props: MyTableProps<T>) => {
  const { height, pagination, isDraggable, onDragFinish, ...rest } = props;

  const defaultPagination = {
    size: 'default',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    defaultPageSize: 20,
  };

  const combinedPagination = typeof pagination === 'object' ? { ...defaultPagination, ...pagination } : {};

  if (isDraggable) {
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
      if (props?.dataSource) {
        const newDataSource = props?.dataSource?.map((el: any, index: number) => {
          if (el.key) {
            return el;
          }

          return { ...el, key: index + 1 };
        });

        setDataSource(newDataSource);
      }
    }, [props?.dataSource]);

    interface RowContextProps {
      setActivatorNodeRef?: (element: HTMLElement | null) => void;
      listeners?: SyntheticListenerMap;
    }

    const RowContext = React.createContext<RowContextProps>({});

    const DragHandle: React.FC = () => {
      const { setActivatorNodeRef, listeners } = useContext(RowContext);

      return (
        <Button
          type="text"
          size="small"
          icon={<HolderOutlined />}
          style={{ cursor: 'move' }}
          ref={setActivatorNodeRef}
          {...listeners}
        />
      );
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        setDataSource((prevState: any) => {
          const activeIndex = prevState.findIndex((record: any) => record.key === active?.id);
          const overIndex = prevState.findIndex((record: any) => record.key === over?.id);

          onDragFinish?.(arrayMove(prevState, activeIndex, overIndex));

          return arrayMove(prevState, activeIndex, overIndex);
        });
      }
    };

    const cols: TableColumnsType<any> = [
      { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
      ...(rest?.columns ?? []),
    ];

    interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
      'data-row-key': string;
    }

    const Row: React.FC<RowProps> = props => {
      const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable(
        {
          id: props['data-row-key'],
        },
      );

      const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
      };

      const contextValue = useMemo<RowContextProps>(
        () => ({ setActivatorNodeRef, listeners }),
        [setActivatorNodeRef, listeners],
      );

      return (
        <RowContext.Provider value={contextValue}>
          <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
      );
    };

    return (
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={dataSource?.map((i: any) => i?.key)} strategy={verticalListSortingStrategy}>
          <div style={{ height }} css={styles}>
            <Table
              {...rest}
              dataSource={dataSource}
              columns={cols}
              rowKey="key"
              scroll={{ x: 'max-content', y: '100%' }}
              pagination={combinedPagination}
              components={{ body: { row: Row } }}
            />
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div style={{ height }} css={styles}>
      <Table<T>
        scroll={{
          x: 'max-content',
          // x: '140%',
          // y: '100%',
        }}
        {...rest}
        pagination={combinedPagination}
      />
    </div>
  );
};

MyTable.defaultProps = {
  size: 'small',
  height: 'auto',
} as MyTableProps<any>;

MyTable.Column = TableColumn;
MyTable.ColumnGroup = Table.ColumnGroup;

export default MyTable;

const styles = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-container {
    height: 100%;
  }
  .ant-spin-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .ant-table {
      flex: 1;
      overflow: hidden;
      border-bottom: 1px solid #eee;

      .ant-table-container {
        display: flex;
        flex-direction: column;
        .ant-table-body {
          overflow-x: auto !important;
          flex: 1;
          table {
            height: 100%;
          }
        }
      }
    }

    .ant-pagination {
      padding: 0 10px;
    }
  }
`;
