import type { RootState } from '@/generic/stores';
import type { PermissonsDto } from '@/interface/admin';

import { Collapse, Switch } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import { useSelector } from 'react-redux';

interface Props {
  data: PermissonsDto[];
  onChangeSwitch: (checked: boolean, data: any) => void;
  isAdmin?: boolean;
}

export default function CollapseSwitch({ data, onChangeSwitch, isAdmin }: Props) {
  const { theme } = useSelector((state: RootState) => state.global);

  console.log(data);

  const renderRecursiveCollapse = (
    items: PermissonsDto[],
    onChangeSwitch: (checked: boolean, item: any) => void,
    parentIndex = '',
  ): React.ReactNode => {
    return items.map((el, index) => {
      const key = `${parentIndex}-${index}`;

      if (el.children && el.children.length > 0) {
        return (
          <Collapse key={key} className="mb-5" style={{ backgroundColor: '#fafafa' }}>
            <CollapsePanel
              header={el.action}
              key={key}
              className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-[#fafafa]'}`}
            >
              {/* select all switch */}
              <div className="flex items-center gap-4 justify-end p-2">
                <p>Select all :</p>
                <Switch
                  disabled={isAdmin}
                  checked={isAdmin ? true : el.value}
                  onChange={checked => onChangeSwitch(checked, el)}
                />
              </div>

              <div
                className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-[#fafafa]'} flex flex-col p-2 rounded-xl border-solid border-[1px] border-[#ccc] mb-5`}
              >
                {renderRecursiveCollapse(el.children, onChangeSwitch, key)}
              </div>
            </CollapsePanel>
          </Collapse>
        );
      } else {
        return (
          <div
            key={key}
            className={`${theme === 'dark' ? 'bg-[#141414]' : 'bg-white'} flex flex-col p-2 rounded-xl border-solid border-[1px] border-[#ccc] mb-5`}
          >
            <div className="flex justify-between items-center">
              <div className="w-fit">{el.action}</div>
              <Switch
                disabled={isAdmin}
                checked={isAdmin ? true : el.value}
                onChange={checked => onChangeSwitch(checked, el)}
              />
            </div>
          </div>
        );
      }
    });
  };

  return <>{renderRecursiveCollapse(data, onChangeSwitch)}</>;
}
