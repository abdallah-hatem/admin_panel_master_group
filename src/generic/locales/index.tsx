import type { FC } from 'react';
import type { MessageDescriptor } from 'react-intl';

import { FormattedMessage, useIntl } from 'react-intl';

import en_US from './en-US';
import pt_PT from './pt-PT';

export const localeConfig = {
  pt_PT: pt_PT,
  en_US: en_US,
};

type Id = keyof typeof en_US;

interface Props extends MessageDescriptor {
  id: Id;
}

export const LocaleFormatter: FC<Props> = ({ ...props }) => {
  const notChildProps = { ...props, children: undefined };

  console.log(props);

  return <FormattedMessage {...notChildProps} id={props.id} />;
};

// type FormatMessageProps = (descriptor: Props) => string;

type FormatMessageProps = (descriptor: MessageDescriptor, values?: Record<string, any>, fallback?: string) => string | number | boolean | React.ReactNode | Iterable<React.ReactNode> | undefined;

export const useLocale = () => {
  const { formatMessage: _formatMessage, ...rest } = useIntl();

  const formatMessage: FormatMessageProps = (descriptor, values, fallback) => {
    const message = _formatMessage({ id: descriptor.id, defaultMessage: fallback || descriptor.id }, values);

    console.log(descriptor.id);
    console.log(message);

    return message || fallback || descriptor.id;
  };

  return {
    ...rest,
    formatMessage,
  };
};
