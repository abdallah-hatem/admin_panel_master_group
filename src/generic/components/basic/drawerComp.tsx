import type { DrawerStyles } from 'antd/es/drawer/DrawerPanel';
import type { ReactElement } from 'react';

import { Button, Drawer } from 'antd';
import React, { cloneElement, useState } from 'react';

interface Props {
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
  trigger: ReactElement;
  onSubmit?: () => void;
  onClear?: () => void;
  hideButtons?: boolean;
  styles?: DrawerStyles;
}

export default function DrawerComp({
  title,
  onClose,
  children,
  trigger,
  onClear,
  onSubmit,
  hideButtons = false,
  styles,
}: Props) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const _onClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const triggerWithOnClick = cloneElement(trigger, {
    onClick: showDrawer,
  });

  return (
    <>
      {triggerWithOnClick}
      <Drawer title={title} onClose={_onClose} open={open} styles={styles}>
        <div className="flex flex-col justify-between min-h-full">
          <div>{children}</div>

          {!hideButtons && (
            <div className="flex">
              <Button type="primary" className="w-2/3" onClick={onSubmit}>
                Filter
              </Button>

              <Button type="primary" className="w-1/3" onClick={onClear}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
