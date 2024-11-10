import type { RootState } from '@/generic/stores';

import { useSelector } from 'react-redux';

interface Props {
  children: React.ReactNode;
  styleTw?: string;
}

export default function CardComp({ children, styleTw }: Props) {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <div
      className={`flex flex-col w-[500px] mx-auto rounded-3xl !p-5 my-auto shadow-md max-[900px]:w-full ${styleTw} ${
        theme === 'dark' ? 'bg-[#141414]' : 'bg-white'
      }`}
    >
      {children}
    </div>
  );
}
