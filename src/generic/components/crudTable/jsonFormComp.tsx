import type { RootState } from '@/generic/stores';
import type { FormProps as JSFormProps } from '@rjsf/core';
import type { RegistryFieldsType, RegistryWidgetsType } from '@rjsf/utils';

import { Form as JSForm } from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { Button } from 'antd';
import { type ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getRandomNumber } from '@/generic/helpers/genral';
import { customValidate, filterObjectBySchema, transformData, transformFormData } from '@/generic/helpers/jsonForm';
import useFetch from '@/generic/hooks/useFetch';

import ObjectFieldTemplate from '../jsonForm/customFields/customInputField';
import CustomRowField from '../jsonForm/customFields/customRowField';
import DynamicSelectTwoFields from '../jsonForm/customFields/dynamicSelectTwoFields';
import InputSelectField from '../jsonForm/customFields/inputSelectField';
import SelectAddField from '../jsonForm/customFields/selectAddField';
import StarRatingField from '../jsonForm/customFields/starRatingField';
import TreeSelectField from '../jsonForm/customFields/treeSelectField';
import UploadFilesField from '../jsonForm/customFields/uploadFilesField';
import InputWithSelectWidget from '../jsonForm/customWidgets/inputWithSelectWidget';
import SelectWidget from '../jsonForm/customWidgets/selectWidget';

interface Props {
  current?: any;
  jsFormProps?: JSFormProps;
  onFinish: (data?: any) => void;
  getJsonFormDataAdd?: any;
  getJsonFormDataUpdate?: any;
  getJsonFormDataUpdateParams?: any;
  getJsonFormDataAddParams?: any;
  children?: ReactNode;
}

export default function JsonFormComp({
  current,
  jsFormProps,
  getJsonFormDataAdd,
  getJsonFormDataUpdate,
  getJsonFormDataAddParams,
  getJsonFormDataUpdateParams,
  onFinish,
  children,
}: Props) {
  const newCurrent = { ...current };

  delete newCurrent?.id;

  // const { data: result } =
  //   getJsonFormDataAdd && !current
  //     ? useFetch<any>({ GET: getJsonFormDataAdd, params: getJsonFormDataAddParams, dependencies: [getJsonFormDataAdd] })
  //     : useFetch<any>({
  //         GET: getJsonFormDataUpdate,
  //         params: { id: current?.id, ...getJsonFormDataUpdateParams },
  //         dependencies: [current?.id],
  //       });

  const { createButtonClickCount } = useSelector((state: RootState) => state.form);

  const { data: result, refetch: refetchAdd } = useFetch<any>({
    GET: getJsonFormDataAdd,
    params: getJsonFormDataAddParams,
    dependencies: [getJsonFormDataAdd, createButtonClickCount],
    allowedToFetch: getJsonFormDataAdd && !current,
  });

  const { data: resultUpdate, refetch: refetchUpdate } = useFetch<any>({
    GET: getJsonFormDataUpdate,
    params: { id: current?.id, ...getJsonFormDataUpdateParams },
    dependencies: [current?.id],
    allowedToFetch: getJsonFormDataUpdate && current,
  });

  const { schema, ui_schema: uiSchema } = result || resultUpdate || {};

  // console.log(schema);
  // console.log(uiSchema);

  // console.log(jsFormProps?.schema);
  // console.log(jsFormProps?.uiSchema);

  const customWidgets: RegistryWidgetsType = {
    InputWithSelectWidget,
    SelectWidget,
  };

  const fields: RegistryFieldsType = {
    InputSelectField,
    CustomRowField,
    SelectAddField,
    UploadFilesField,
    DynamicSelectTwoFields,
    StarRatingField,
    TreeSelectField,
  };

  return (
    (schema || jsFormProps?.schema) && (
      <div className="w-[95%] mx-auto overflow-hidden">
        <JSForm
          className="overflow-hidden"
          formData={schema && newCurrent && filterObjectBySchema(schema, transformData(schema, newCurrent))}
          showErrorList={false}
          onSubmit={({ formData, uiSchema }) => {
            console.log(transformFormData(formData, uiSchema));

            onFinish(transformFormData(formData, uiSchema));
          }}
          customValidate={customValidate}
          onError={e => console.log(e)}
          {...jsFormProps}
          widgets={customWidgets}
          fields={fields}
          validator={validator}
          templates={{ ObjectFieldTemplate }}
          schema={schema ?? jsFormProps?.schema}
          uiSchema={uiSchema ?? jsFormProps?.uiSchema}
        >
          {children ?? (
            <Button type="primary" htmlType="submit" className="float-right">
              Submit
            </Button>
          )}
        </JSForm>
      </div>
    )
  );
}
