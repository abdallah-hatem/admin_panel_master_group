import { EnumKeys } from '@/api/enums';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

interface Props {}

const useFormListPriceData = ({}: Props) => {
  const { data: languages } = useEnum({ enumKey: EnumKeys.Languages });

  const { formatMessage } = useLocale();

  const formData: any = (field: any) => [
    {
      key: field.key,
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.language' }),
        formatMessage({ id: 'activities.form.language_desc' }),
      ),
      name: [field.name, 'languages'],
      type: 'select',
      required: true,
      options: languages?.map((el: any) => ({ label: el.suggestion, value: el.id })),
      innerProps: { mode: 'multiple' },
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.language' }),
        },
      ],
    },
  ];

  return formData;
};

export default useFormListPriceData;
