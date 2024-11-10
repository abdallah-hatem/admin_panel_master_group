import { Form } from 'antd';
import { useCallback, useMemo } from 'react';

import EditableTable from './editableTable';

interface Props {
  clientTypes: any;
  modifierName: any;
  formatMessage: any;
  form: any;
  modifierRestField: any;
  activityData: any;
  optionIndex: any;
  priceIndex: any;
  modifierIndex: any;
  typesData: any;
}

const ClientTypesForm = ({
  clientTypes,
  modifierName,
  formatMessage,
  form,
  modifierRestField,
  activityData,
  optionIndex,
  priceIndex,
  modifierIndex,
  typesData,
}: Props) => {
  const dataTypes = useMemo(() => {
    return typesData?.filter((el: any) => el.index === optionIndex)[priceIndex];
  }, [typesData, optionIndex, priceIndex]);

  console.log(clientTypes);

  console.log(typesData);

  console.log(dataTypes);

  const getDataSources = useCallback(() => {
    if (clientTypes && dataTypes) {
      const clients = dataTypes?.data?.map((el: any) => ({
        key: el.id,
        minimum_age: el.minimum_age,
        maximum_age: el.maximum_age,
        id: el.client_type,
      }));

      const filtetTypes = clientTypes
        ?.filter((el: any) => !clients?.find((client: any) => client.id === el.id))
        .map((el: any) => ({
          ...el,
          key: el.id,
          minimum_age: 0,
          maximum_age: 0,
        }));

      return [...clients, ...filtetTypes];
    }

    return clientTypes?.map((el: any) => ({
      ...el,
      key: el.id,
      minimum_age: 0,
      maximum_age: 0,
    }));
  }, [clientTypes, dataTypes]);

  console.log(getDataSources());

  const handleTableChange = useCallback(
    (updatedDataSource: any) => {
      // Update the form value for 'client_type_age_ranges' when the table changes
      form.setFieldsValue({
        [modifierName]: {
          client_type_age_ranges: updatedDataSource,
        },
      });
    },
    [form, modifierName],
  );

  console.log(
    // form.getFieldsValue(),
    form.getFieldValue(['activity_options', optionIndex, 'schedule_prices', priceIndex, 'modifiers'])[0]
      ?.client_type_age_ranges,
  );

  return (
    <Form.Item {...modifierRestField} name={[modifierName, 'client_type_age_ranges']} label="Clients Age Ranges">
      <EditableTable
        optionIndex={optionIndex}
        priceIndex={priceIndex}
        form={form}
        modifierName={modifierName}
        clientTypes={clientTypes}
        //   dataSource={getDataSources()}
        onChange={handleTableChange}
      />
    </Form.Item>
  );
};

export default ClientTypesForm;
