interface MenuItem {
  /** menu item code */
  code: string;
  /** menu labels */
  label: {
    pt_PT: string;
    fr_FR: string;
    en_US: string;
  };
  icon?: string;
  path: string;
  children?: MenuItem[];

  hidden?: boolean;

  accessRoutes?: { route: string; method: string }[];
}

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
