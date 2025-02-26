/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { FC, ReactElement } from 'react';
import type { RouteProps } from 'react-router';

import { useIntl } from 'react-intl';

import PrivateRoute from '@/generic/routes/privateRoute';

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  auth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
  const { formatMessage } = useIntl();

  // if (titleId) {
  //   document.title = formatMessage({
  //     id: titleId,
  //   });
  // }

  return auth ? <PrivateRoute {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
