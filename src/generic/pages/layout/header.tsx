/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { FC } from 'react';

import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, message, theme as antTheme, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avator from '@/assets/header/avator.jpeg';
import EnUsSvg from '@/assets/header/enUsSvg';
import FrLangSvg from '@/assets/header/FrLangSvg';
import LangSvg from '@/assets/header/langSvg';
import MoonSvg from '@/assets/header/moonSvg';
import PtLangSvg from '@/assets/header/ptLangSvg';
import SunSvg from '@/assets/header/sunSvg';
import LogoImg from '@/assets/logo/logo_prim.png';
import { CHANGE_USERS_LOCALE } from '@/generic/api/user.api';
import { setGlobalState } from '@/generic/stores/global.store';
import { setUserItem } from '@/generic/stores/user.store';
import { LocaleFormatter, useLocale } from '@/locales';

import { logoutAsync } from '../../stores/user.action';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, locale, device } = useSelector((state: any) => state.user);
  const { theme } = useSelector((state: any) => state.global);
  const navigate = useNavigate();
  const token = antTheme.useToken();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        // @ts-ignore
        dispatch(logoutAsync());

        return;
    }
  };

  const toLogin = () => navigate('/login');

  const selectLocale = ({ key }: { key: any }) => {
    dispatch(setUserItem({ locale: key }));
    localStorage.setItem('locale', key);
  };

  const onChangeTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    dispatch(
      setGlobalState({
        theme: newTheme,
      }),
    );
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />} onClick={() => (window.location.href = '/profile')}>
        <LocaleFormatter id="header.avator.account" />
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<LogoutOutlined />}
        onClick={() => {
          onActionClick('logout');
          window.location.href = '/login';
        }}
      >
        <LocaleFormatter id="header.avator.logout" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="layout-page-header bg-2" style={{ backgroundColor: token.token.colorBgContainer }}>
      {device !== 'MOBILE' && (
        <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
          {/* <img src={ReactSvg} alt="" style={{ marginRight: collapsed ? '2px' : '20px' }} />
          <img src={AntdSvg} alt="" /> */}
          <img src={LogoImg} alt="" className=" min-w-[85%] min-h-[85%]" />
        </div>
      )}
      <div className="layout-page-header-main">
        <div onClick={toggle}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
        <div className="actions">
          <Tooltip
            title={formatMessage({
              id: theme === 'dark' ? 'gloabal.tips.theme.lightTooltip' : 'gloabal.tips.theme.darkTooltip',
            })}
          >
            <span>{<div onClick={onChangeTheme}>{theme === 'dark' ? <SunSvg /> : <MoonSvg />}</div>}</span>
          </Tooltip>
          {/* <HeaderNoticeComponent /> */}
          <Dropdown
            menu={{
              onClick: info => {
                selectLocale(info);
                console.log(info.key);
                let locale = '';

                switch (info.key) {
                  case 'pt_PT':
                    locale = 'PT';
                    break;
                  case 'en_US':
                    locale = 'EN';
                    break;
                  case 'fr_FR':
                    locale = 'FR';
                    break;
                }

                CHANGE_USERS_LOCALE({ data: { locale } }).then((res: any) => {
                  if (!res) return message.error('Failed to change locale');

                  localStorage.setItem('userNavPermissions', JSON.stringify(res?.new_nav_permissions));
                  window.location.reload();
                });
              },
              items: [
                {
                  key: 'pt_PT',
                  icon: <PtLangSvg />,
                  disabled: locale === 'pt_PT',
                  label: 'Portuguese',
                },
                {
                  key: 'en_US',
                  icon: <EnUsSvg />,
                  disabled: locale === 'en_US',
                  label: 'English',
                },
                {
                  key: 'fr_FR',
                  icon: <FrLangSvg />,
                  disabled: locale === 'fr_FR',
                  label: 'French',
                },
              ],
            }}
          >
            <span>
              <LangSvg />
            </span>
          </Dropdown>

          {logged ? (
            <Dropdown overlay={menu}>
              <span className="user-action">
                <img src={Avator} className="user-avator" alt="avator" />
              </span>
            </Dropdown>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={toLogin}>
              {formatMessage({ id: 'gloabal.tips.login' })}
            </span>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
