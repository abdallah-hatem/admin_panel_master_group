import type { RootState } from '@/generic/stores';

import { useSelector } from 'react-redux';

import PieChartComp from '@/generic/components/basic/pieChartComp';

interface Props {
  data: any;
}

export default function PieChartSection({ data }: Props) {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <div className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-white'}  p-5 h-[300px] rounded-3xl shadow-md`}>
      <h2 className="text-xl text-center">Events by action</h2>
      <PieChartComp data={data} />
    </div>
  );
}
