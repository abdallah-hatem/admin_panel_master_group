import type { RootState } from '@/generic/stores';

import { Card } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Home() {
  const { userNavPermissions } = useSelector((state: RootState) => state.user);

  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme === 'dark' ? 'bg-[#141414]' : 'bg-white'} gap-5 rounded-3xl !p-5 m-5 shadow-md`}
    >
      {userNavPermissions?.map((el: any, index: number) => (
        <Card key={index} title={el.label} className="max-h-[250px]">
          <div className="grid min-[500px]:grid-cols-2 grid-cols-1">
            {el.children.length > 0 &&
              el.children.map((child: any) => (
                <Link key={child.route} to={child.route} className="mb-2 text-orange-600 hover:underline">
                  {child.label}
                </Link>
              ))}

            {
              <Link key={el.route} to={el.route} className="mb-2 text-orange-600 hover:underline">
                {el.label}
              </Link>
            }
          </div>
        </Card>
      ))}
    </div>
  );
}
