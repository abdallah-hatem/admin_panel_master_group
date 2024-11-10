import { DeleteFilled } from '@ant-design/icons';
import { Form, message } from 'antd';
import { useEffect } from 'react';

import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import { getTitleWithDescription } from '@/generic/helpers/jsonForm';
import { useLocale } from '@/locales';

import useFormData from './formData';
import useFunctions from './functions';

interface Props {
  onSubmit?: (value: any, optionId?: string) => void;
  optionData?: any;
  onDelete?: (optionId?: string, notSubmittedIndex?: number) => void;
  showSubmit?: boolean;
  formRef?: any;
  removeDelete?: boolean;
  cardStyleTw?: string;
  formRef2?: any;
  type?: 'schedule_prices' | 'full_activity_option';
}

export default function ActivityOption({
  onSubmit,
  optionData,
  onDelete,
  showSubmit = true,
  formRef: _formRef,
  removeDelete = false,
  cardStyleTw,
  formRef2,
  type = 'full_activity_option',
}: Props) {
  const formRef = _formRef || Form.useForm()[0];

  const { formatMessage } = useLocale();

  console.log(optionData);

  useEffect(() => {
    if (optionData && !optionData?.notSubmittedIndex) {
      const reverseData = (data: any): any => {
        return {
          title: data.title,
          description: data.description,
          cutoff_time: data.cutoff_time.toString(), // Convert cutoff_time back to string
          cutoff_time_unit: data.cutoff_time_unit,
          schedule_prices: data.schedule_prices.map((schedulePrice: any) => {
            let client_types = undefined;
            let client_types_table: any[] = [];
            let minimum_participants = undefined;
            let maximum_participants = undefined;
            let languages: string[] = [];

            // Process the modifiers to convert back to the original format
            schedulePrice.modifiers.forEach((modifier: any) => {
              switch (modifier._type) {
                case 'general_age_range':
                  client_types = 'general';
                  minimum_participants = modifier.minimum_participants;
                  maximum_participants = modifier.maximum_participants;
                  break;

                case 'client_type_age_range':
                  client_types = 'age_range';
                  minimum_participants = modifier.minimum_participants;
                  maximum_participants = modifier.maximum_participants;
                  client_types_table = modifier.client_types.map((clientType: any) => ({
                    client_type: clientType.client_type,
                    minimum_age: clientType.minimum_age,
                    maximum_age: clientType.maximum_age,
                  }));
                  break;

                case 'language_modifier':
                  languages = modifier.languages.map((languageObj: any) => languageObj.language);
                  break;

                default:
                  break;
              }
            });

            // Return the original structure for each schedule_price
            return {
              price: schedulePrice.price,
              currency: schedulePrice.currency,
              client_types: client_types, // 'general' or 'age_range'
              client_types_table: client_types_table.length > 0 ? client_types_table : [],
              minimum_participants: minimum_participants,
              maximum_participants: maximum_participants,
              languages: languages.length > 0 ? languages : undefined, // Ensure empty array returns undefined
            };
          }),
        };
      };

      const reversedData = reverseData(optionData);

      console.log(reversedData);

      formRef.setFieldsValue({ ...reversedData });

      console.log(formRef.getFieldsValue());
    }
  }, [optionData]);

  const formData = useFormData({ formRef, type });

  const { onFinish: onFormSubmit } = useFunctions();

  function onFinish(e: any) {
    console.log('submit');

    onFormSubmit({
      formRef,
      e,
      onSubmit,
      optionData,
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold pl-5">
        {getTitleWithDescription(
          formatMessage({ id: 'activities.form.activity_options' }),
          formatMessage({ id: 'activities.form.activity_options_desc' }),
        )}
      </h1>
      <CardComp styleTw={`w-full ${cardStyleTw}`}>
        <Form layout="vertical">
          {!removeDelete && (
            <div className="flex justify-end" onClick={() => onDelete?.(optionData?.id, optionData?.notSubmittedIndex)}>
              <DeleteFilled style={{ color: 'red' }} className="text-xl cursor-pointer" />
            </div>
          )}
          <MyForm
            form={formRef}
            name="customFrequency"
            layout="vertical"
            className="space-y-4 h-full flex flex-col"
            options={formData}
            showSubmit={showSubmit}
            submitStyleContainerTw="flex flex-col justify-end h-full"
            submitStyleTw="w-full mt-5"
            onSumbit={onFinish}
            submitText={
              optionData && !optionData?.notSubmittedIndex
                ? formatMessage({ id: 'general.update' })
                : formatMessage({ id: 'general.submit' })
            }
          />
        </Form>
      </CardComp>
    </>
  );
}
