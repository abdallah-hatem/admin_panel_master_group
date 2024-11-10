import type { MenuList } from '@/generic/interface/layout/menu.interface';

import { intercepter, mock } from '../config';

const routes = [
  {
    route: '/dashboard',
    label: 'Dashboard',
    icon: 'HomeOutlined',
    children: [],
  },
  {
    route: '/cases',
    label: 'Cases',
    icon: 'AppstoreOutlined',
    permission: 'cases',
    children: [
      {
        route: '/cases/list',
        label: 'Cases',
        icon: 'UnorderedListOutlined',
        children: [],
        permission: 'view_cases',
      },
    ],
  },
  {
    route: '/admin',
    label: 'Admin',
    icon: 'UserSwitchOutlined',
    permission: 'users',
    children: [
      {
        route: '/admin/users',
        label: 'Users',
        icon: 'TeamOutlined',
        children: [],
        permission: 'view_user_details',
      },
      {
        route: '/admin/company_users',
        label: 'Company Users',
        icon: 'UserOutlined',
        children: [],
        permission: 'view_user_details',
      },
      {
        route: '/admin/companies',
        label: 'Companies',
        icon: 'ShopOutlined',
        children: [],
        permission: 'view_user_details',
      },
      {
        route: '/admin/kiosks',
        label: 'Kiosks',
        icon: 'ShopOutlined',
        children: [],
        permission: 'view_user_details',
      },
      {
        route: '/admin/events_explorer',
        label: 'Events Explorer',
        icon: 'BuildOutlined',
        children: [],
        permission: 'view_user_details',
      },
      {
        route: '/admin/roles',
        label: 'Roles',
        icon: 'l',
        children: [],
        permission: 'view_roles',
      },
    ],
  },
];

const mockMenuList: MenuList = routes.map((el: any) => {
  const base = {
    code: el.route,
    label: {
      pt_PT: el.label,
      en_US: el.label,
      fr_FR: el.label,
    },
    icon: el.icon,
    path: el.route,
  };

  if (el.children && el.children.length === 0) {
    return base;
  } else {
    return {
      ...base,
      children: el.children
        ? el.children.map((el2: any) => ({
            code: el2.route,
            label: { pt_PT: el2.label, en_US: el2.label },
            path: el2.route,
            icon: el2.icon,
          }))
        : [],
    };
  }
});

console.log(mockMenuList);

// const filterHiddenItems = (menuList: MenuList): MenuList => {
//   return menuList
//     .filter(item => !item.hidden)
//     .map(item => ({
//       ...item,
//       children: item.children ? filterHiddenItems(item.children) : undefined,
//     }));
// };

// const visibleMenuList = filterHiddenItems(mockMenuList);

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
