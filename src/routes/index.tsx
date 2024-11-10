/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { FC } from 'react';
import type { RouteObject } from 'react-router';

// import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import NotFoundPage from '@/generic/pages/404';
import Home from '@/generic/pages/home';
import LayoutPage from '@/generic/pages/layout';
import LoginPage from '@/generic/pages/login';
import ProfilePage from '@/generic/pages/profile';
import WrapperRouteComponent from '@/generic/routes/config';

const routeList: RouteObject[] = [
  {
    path: '/login',

    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },

  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Home />} titleId="title.dashboard" />,
      },

      ///////////////// Profile /////////////////
      {
        path: 'profile',
        element: <WrapperRouteComponent element={<ProfilePage />} titleId="title.profile" auth />,
      },

      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFoundPage />} titleId="title.notFount" />,
      },
      {
        path: '/errorPage',
        element: (
          <WrapperRouteComponent
            element={
              <NotFoundPage status={'500'} title="500" subTitle="Oops! Something went wrong. Check your network." />
            }
            titleId="title.notFount"
          />
        ),
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
