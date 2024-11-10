import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GET_EVENTS, GET_EVENTS_BY_ACTION, GET_EVENTS_DASHBOARDS, GET_EVENTS_VALUE } from '@/generic/api/events';
import { setFetchState } from '@/generic/stores/fetch.store';

import LineChartSection from './components/lineChartSection';
import PieChartSection from './components/PieChartSection';
import TotalEventsSection from './components/totalEventsSection';
import EventsTable from './eventsTable';

export default function EventPage() {
  const dispatch = useDispatch();

  const [data, setData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [eventsValue, setEventsValue] = useState<number>(0);
  const [pieData, setPieData] = useState<any>(null);

  const { page, per_page } = useSelector((state: any) => state.fetch);

  const getEventsData = (params?: object) => {
    console.log(params);

    const base = {
      page: page,
      per_page: per_page,
    };

    const _params = params
      ? {
          ...base,
          ...params,
        }
      : base;

    GET_EVENTS(_params).then((res: any) => {
      setData(res.result);
      dispatch(setFetchState(res.pagination));
    });
  };

  const getDahsboards = (params?: object) =>
    GET_EVENTS_DASHBOARDS(params).then((res: any) => setDashboardData(res?.result));

  const getEventsValue = (params?: object) =>
    GET_EVENTS_VALUE(params).then((res: any) => setEventsValue(res?.value ?? 0));

  const getEventsByAction = (params?: object) =>
    GET_EVENTS_BY_ACTION(params).then((res: any) => setPieData(res?.result));

  const getAllData = (params?: object) => {
    params ? getEventsData(params) : getEventsData();
    params ? getDahsboards(params) : getDahsboards();
    params ? getEventsValue(params) : getEventsValue();
    params ? getEventsByAction(params) : getEventsByAction();
  };

  useEffect(() => {
    getAllData();
  }, []);

  const customComps = (
    <div className="mb-10">
      <div className="grid grid-cols-2 gap-10 mb-5">
        <TotalEventsSection number={eventsValue} />
        <PieChartSection data={pieData} />
      </div>
      <LineChartSection data={dashboardData} />
    </div>
  );

  return (
    <div className="h-full">
      <EventsTable data={data} getAllData={getAllData} getEventsData={getEventsData} customComps={customComps} />
    </div>
  );
}
