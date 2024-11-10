import type { ResultStatusType } from 'antd/es/result';

import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/locales';

interface Props {
  status: ResultStatusType;
  title: string;
  subTitle: string;
}

const NotFoundPage = ({ status = '404', title = '404', subTitle }: Props) => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle ?? formatMessage({ id: 'gloabal.tips.notfound' })}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {formatMessage({ id: 'gloabal.tips.backHome' })}
        </Button>
      }
    ></Result>
  );
};

export default NotFoundPage;
