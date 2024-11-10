import { EnumKeys } from '@/api/enums';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import useEnum from '@/generic/hooks/useEnum';
import { useLocale } from '@/locales';

import useFormListAgesData from './formListAgesData';
import useFormListPriceData from './formListPrice';

interface Props {
  formRef?: any;
}

const useFormListData = ({ formRef }: Props) => {
  const { data: currencies } = useEnum({ enumKey: EnumKeys.Currencys });

  const formListPriceData = useFormListPriceData({});
  const formListAgesData = useFormListAgesData({ formRef });

  const { formatMessage } = useLocale();

  const formData: any = (field: any) => [
    {
      key: field.key,
      label: getTitleWithDescription(
        formatMessage({ id: 'activities.form.price' }),
        formatMessage({ id: 'activities.form.price_desc' }),
      ),
      name: [field.name, 'price'],
      type: 'input-number',
      required: true,
      addAfter: {
        placeHolder: 'Select Currency',
        data: currencies?.map((el: any) => ({ label: el.suggestion, value: el.id })),
        name: [field.name, 'currency'],
        innerProps: { required: true },
        rules: [
          {
            required: true,
            message: 'please input Currency',
          },
        ],
      },
      rules: [
        {
          required: true,
          message: 'please input ' + formatMessage({ id: 'activities.form.price' }),
        },
      ],
    },
    {
      required: false,
      formListData: formListPriceData,
      formListProps: {
        addBtnText: 'Add language',
        formListName: [field.name, 'languages'],
        btnStyleTw: 'mt-5 !w-[200px]',
      },
    },
    {
      required: false,
      formListData: formListAgesData,
      formListProps: {
        addBtnText: 'Add ages',
        formListName: [field.name, 'ages'],
        btnStyleTw: 'mt-5 !w-[200px]',
      },
    },
  ];

  return formData;
};

export default useFormListData;
