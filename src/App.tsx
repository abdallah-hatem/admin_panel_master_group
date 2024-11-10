/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dayjs/locale/pt';
import 'antd/dist/reset.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import ptPT from 'antd/es/locale/pt_PT'; // portuguese
import dayjs from 'dayjs';
import { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { history, HistoryRouter } from '@/generic/routes/history';
import { setGlobalState } from '@/generic/stores/global.store';

import { localeConfig, LocaleFormatter } from './locales';
import RenderRouter from './routes';

const App: React.FC = () => {
  const { locale } = useSelector((state: any) => state.user);
  const { theme, loading } = useSelector((state: any) => state.global);
  const dispatch = useDispatch();

  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  /** initial theme */
  useEffect(() => {
    // Set default theme to light if no theme is set
    if (!theme) {
      setTheme(false);
    }

    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      function matchMode(e: MediaQueryListEvent) {
        setTheme(e.matches);
      }

      mql.addEventListener('change', matchMode);

      return () => mql.removeEventListener('change', matchMode);
    }
  }, [theme]);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      dayjs.locale('en');
    } else if (locale === 'pt_PT') {
      dayjs.locale('zh-cn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'pt_PT') {
      return ptPT;
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ConfigProvider
        locale={getAntdLocale()}
        componentSize="middle"
        theme={{
          token: { colorPrimary: '#EA5740' },
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        }}
      >
        {/* @ts-ignore */}
        <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
          {/* @ts-ignore */}
          <HistoryRouter history={history}>
            <Suspense fallback={null}>
              <Spin
                spinning={loading}
                className="app-loading-wrapper"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.44)' : 'rgba(255, 255, 255, 0.44)',
                }}
                tip={<LocaleFormatter id="gloabal.tips.loading" />}
              ></Spin>
              <RenderRouter />
            </Suspense>
          </HistoryRouter>
        </IntlProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
