import { message } from 'antd';

interface Props {
  formRef: any;
  onSubmit?: (value: any, optionId?: string) => void;
  optionData?: any;
  e?: any;
  returnRawData?: boolean;
}

const useFunctions = () => {
  const onFinish = async ({ formRef, onSubmit, optionData, e, returnRawData }: Props) => {
    e?.preventDefault();

    // const data = formRef.getFieldsValue();
    const data = await formRef.validateFields();

    console.log(data);

    if (data?.schedule_prices?.length === 0 || !data.schedule_prices) {
      console.log(data);

      return message.error('Schedule prices are required');
      // return formRef.setFields([{ name: ['schedule_prices'], errors: ['Schedule prices are required'] }]);
    }

    if (data.schedule_prices.some((el: any) => (el.languages?.length === 0 || !el.languages) && !el.client_types)) {
      return message.error('Client or language are required');
    }

    console.log(data);

    const transformData = (data: any): any => {
      return {
        title: data.title,
        description: data.description,
        cutoff_time: parseInt(data.cutoff_time),
        cutoff_time_unit: data.cutoff_time_unit,
        schedule_prices: data?.schedule_prices?.map((schedulePrice: any) => {
          const modifiers: any[] = [];

          console.log(schedulePrice);

          if (
            schedulePrice?.client_types === 'general' &&
            schedulePrice.minimum_participants &&
            schedulePrice.maximum_participants
          ) {
            modifiers.push({
              _type: 'general_age_range',
              minimum_participants: schedulePrice.minimum_participants,
              maximum_participants: schedulePrice.maximum_participants,
            });
          }

          // Handle age ranges if they exist and are not empty
          if (
            schedulePrice.client_types_table &&
            schedulePrice.client_types_table.length > 0 &&
            schedulePrice?.client_types === 'age_range'
          ) {
            const ageRange = schedulePrice.client_types_table; // Assume only the first age range

            console.log(ageRange);

            if (ageRange) {
              // Client type age range modifier
              if (ageRange?.length > 0) {
                modifiers.push({
                  _type: 'client_type_age_range',
                  client_types: ageRange.map((el: any) => ({
                    client_type: el.client_type,
                    minimum_age: el.minimum_age,
                    maximum_age: el.maximum_age,
                  })),
                  minimum_participants: schedulePrice.minimum_participants,
                  maximum_participants: schedulePrice.maximum_participants,
                });
              }
              // General age range modifier
              else {
                modifiers.push({
                  _type: 'general_age_range',
                  minimum_participants: schedulePrice.minimum_participants,
                  maximum_participants: schedulePrice.maximum_participants,
                });
              }
            }
          }

          // Handle languages if they exist
          if (schedulePrice.languages && schedulePrice.languages.length > 0) {
            modifiers.push({
              _type: 'language_modifier',
              languages: schedulePrice.languages.map((el: any) => ({
                language: el,
              })),
            });
          }

          return {
            price: schedulePrice.price,
            currency: schedulePrice.currency,
            modifiers: modifiers,
          };
        }),
      };
    };

    const transformedData = transformData(data);

    console.log(transformedData);

    if (returnRawData) return transformedData;

    if (optionData) return onSubmit?.(transformedData, optionData?.id);

    onSubmit?.(transformedData);
  };

  return { onFinish };
};

export default useFunctions;
