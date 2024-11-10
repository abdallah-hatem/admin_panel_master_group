import { Button, Tabs } from 'antd';
import { useRef, useState } from 'react';

import CreatePackage from './createPackage';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function AddPackage() {
  const defaultPanes = new Array(1).fill(null).map((_, index) => {
    const id = String(index + 1);

    return { label: `Package ${id}`, children: <CreatePackage />, key: id };
  });

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;

    setItems([...items, { label: `Package ${items.length + 1}`, children: <CreatePackage />, key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    const targetIndex = items.findIndex(pane => pane.key === targetKey);
    const newPanes = items.filter(pane => pane.key !== targetKey);

    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];

      setActiveKey(key);
    }

    setItems(newPanes);
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div>
      <Tabs hideAdd onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onEdit} items={items} />
    </div>
  );
}