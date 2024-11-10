/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { MyAsideProps } from '../aside';
import type { MyRadioCardssOption } from '../radio-cards';
import type { MyTabsOption } from '../tabs';
import type { MyResponse } from '@/generic/api/request';
import type { PageData } from '@/interface';
import type { PaginationProps, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import type { ReactNode } from 'react';

import { css } from '@emotion/react';
import { data } from 'autoprefixer';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import MyTable from '@/generic/components/core/table';
import { useStates } from '@/generic/utils/use-states';

import MyAside from '../aside';
import MySearch from '../search';

interface SearchApi {
  (params?: any): MyResponse<PageData<any>>;
}

type ParseDataType<S> = S extends (params?: any) => MyResponse<PageData<infer T>> ? T : S;

export type MyPageTableOptions<S> = ColumnsType<S>;
export interface PageProps<S> {
  searchRender?: React.ReactNode;
  pageApi?: S;
  pageParams?: object;
  tableOptions?: MyPageTableOptions<ParseDataType<S>>;
  tableRender?: (data: MyPageTableOptions<ParseDataType<S>>[]) => React.ReactNode;
  asideData?: MyAsideProps['options'];
  asideKey?: string;
  asideValue?: string | number;
  radioCardsData?: MyRadioCardssOption[];
  radioCardsValue?: string | number;
  asideTreeItemRender?: MyAsideProps['titleRender'];
  tabsData?: MyTabsOption[];
  tabsValue?: string | number;
  action?: boolean;
  onRowClick?: (record: any) => void;
  rowSelection?: any;
  data?: any[];
  components?: any;
  rowClassName?: any;
  topButtons?: ReactNode[];
  tableStyleTw?: string;
  customComponents?: any;
  pagination?: PaginationProps;
  loading?: boolean;
  expandable?: any;
  onDataFetch?: (data?: any) => void;
  GET_ID?: number | string;
  rowKey?: any;
  tableProps?: TableProps;
  isDraggable?: boolean;
  onDragFinish?: (data: any) => void;
  dependencies?: any[];
}

export interface RefPageProps {
  setAsideCheckedKey: (key?: string) => void;
  load: (data?: object) => Promise<void>;
}

const BasePage = <S extends SearchApi>(props: PageProps<S>, ref: React.Ref<RefPageProps>) => {
  const {
    pageApi,
    pageParams,
    tableOptions,
    tableRender,
    asideKey,
    asideData,
    asideValue,
    action,
    onRowClick,
    rowSelection,
    data,
    components,
    rowClassName,
    topButtons,
    tableStyleTw,
    customComponents,
    pagination,
    onDataFetch,
    GET_ID,
    rowKey,
    tableProps,
    loading: _loading, // _loading has priority over loading in useState
    isDraggable,
    onDragFinish,
    dependencies = [],
  } = props;
  const [pageData, setPageData] = useStates<PageData<ParseDataType<S>>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
    data: data ?? [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (data && data.length >= 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setPageData({ total: 10, data });
    }
  }, [data]);

  const [asideCheckedKey, setAsideCheckedKey] = useState(asideValue);

  useEffect(() => {
    if (asideData) {
      // @ts-ignore
      setAsideCheckedKey(asideData[0].key);
    }
  }, [asideData]);

  const getPageData = useCallback(
    async (params: Record<string, any> = {}) => {
      if (asideKey && !asideCheckedKey) return;

      console.log(pageParams);

      if (pageApi) {
        setLoading(true);

        const obj = {
          ...params,
          ...pageParams,
          per_page: pageData.pageSize,
          page: pageData.pageNum,
          [asideKey!]: asideCheckedKey,
        };

        let res: any = await pageApi(GET_ID ?? obj);

        res = {
          result: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data: res?.result ? res.result : res,
          },

          pagination: res?.pagination,
        };

        console.log(res);

        onDataFetch?.(res);

        if (res.result) {
          setPageData({ total: res?.pagination?.count ?? 10, data: res.result.data });
          setLoading(false);

          return;
        }

        setPageData({ total: res.result.total, data: res.result.data });
        setLoading(false);

        // if (res.status) {
        //   setPageData({ total: res.result.total, data: res.result.data });
        // }
      }
    },
    [
      pageApi,
      //  pageParams,
      pageData.pageSize,
      pageData.pageNum,
      asideKey,
      asideCheckedKey,
    ],
  );

  useEffect(() => {
    // getPageData();
    setTimeout(() => {
      getPageData();
    }, 300);
  }, [getPageData, action, ...dependencies]);

  const onPageChange = (pageNum: number, pageSize?: number) => {
    setPageData({ pageNum });

    if (pageSize) {
      setPageData({ pageSize });
    }
  };

  useImperativeHandle(ref, () => ({
    setAsideCheckedKey,
    load: (data?: object) => getPageData(data),
  }));

  console.log(pageData.data);

  return (
    <div className="">
      {topButtons && <div className="max-h-[80px] mb-5 flex justify-end">{topButtons.map(el => el)}</div>}
      {customComponents && customComponents}
      <div css={styles}>
        <div className="tabs-main">
          <div className="aside-main">
            {tableOptions && (
              <div className="table">
                <MyTable
                  isDraggable={isDraggable}
                  onDragFinish={onDragFinish}
                  loading={_loading ?? loading}
                  className={`w-full ${tableStyleTw}`}
                  rowClassName={rowClassName}
                  components={components}
                  height="100%"
                  dataSource={pageData.data}
                  //@ts-ignore
                  columns={tableOptions}
                  rowSelection={rowSelection}
                  onRow={record => ({ onClick: () => onRowClick && onRowClick(record) })}
                  pagination={
                    !data
                      ? {
                          current: pageData.pageNum,
                          pageSize: pageData.pageSize,
                          total: pageData.total,
                          onChange: onPageChange,
                        }
                      : (pagination ?? false)
                  }
                  expandable={props.expandable}
                  rowKey={rowKey}
                  {...tableProps}
                >
                  {tableRender?.(pageData.data)}
                </MyTable>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BasePageRef = forwardRef(BasePage) as <S extends SearchApi>(
  props: PageProps<S> & { ref?: React.Ref<RefPageProps> },
) => React.ReactElement;

type BasePageType = typeof BasePageRef;

interface MyPageType extends BasePageType {
  MySearch: typeof MySearch;
  MyTable: typeof MyTable;
  MyAside: typeof MyAside;
}

const TableComp = BasePageRef as MyPageType;

TableComp.MySearch = MySearch;
TableComp.MyTable = MyTable;
TableComp.MyAside = MyAside;

export default TableComp;

const styles = css`
  display: flex;
  flex-direction: column;
  .tabs-main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .search {
    margin-bottom: 10px;
  }

  .aside-main {
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
    @media screen and (max-height: 800px) {
      overflow: hidden;
    }
  }

  .clicked-row {
    background-color: #e6f7ff !important;
  }
  .normal-row {
    background-color: #fff !important;
  }
  .ant-table-cell {
    position: relative;
    overflow: visible !important; /* Ensure the tooltip is not clipped */
  }
  .table {
    flex: 1;
    overflow: hidden;
    @media screen and (max-height: 800px) {
      overflow: auto;
      min-height: ${!data && '500px;'};
    }
  }
`;
