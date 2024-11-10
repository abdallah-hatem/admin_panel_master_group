import { useParams } from 'react-router-dom';

import { useLocale } from '@/locales';

interface Props {
  activityData?: any;
  createdActivityId?: number | string;
  formRef?: any;
}

export const useUntilForm = ({ activityData, createdActivityId, formRef }: Props) => {
  const { id } = useParams();
  const { formatMessage } = useLocale();

  const data = '';

  return data;
};
