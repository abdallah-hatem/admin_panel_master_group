import type { RootState } from '@/generic/stores';

import { useSelector } from 'react-redux';

import LineChartComp from '@/generic/components/basic/lineChartComp';

interface Props {
  data: any;
}

export default function LineChartSection({ data }: Props) {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <div className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-white'} p-5 rounded-3xl shadow-md`}>
      <h2 className="text-xl text-center">Events by user</h2>
      <LineChartComp data={data} />
    </div>
  );
}
