import type { RootState } from '@/generic/stores';

import { useSelector } from 'react-redux';

interface Props {
  number: number;
}

export default function TotalEventsSection({ number }: Props) {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <div className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-white'} p-5 h-[300px] rounded-3xl shadow-md`}>
      <h2 className="text-xl text-center">Total events</h2>
      <p className="text-5xl font-bold text-center">{number}</p>
    </div>
  );
}
