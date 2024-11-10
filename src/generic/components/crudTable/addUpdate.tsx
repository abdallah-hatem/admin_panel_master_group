import type { FormProps as JSFormProps } from '@rjsf/core';
import type { FormProps } from 'antd/es/form/Form';

import { Form, message } from 'antd';
import { useEffect } from 'react';

import MyForm from '@/generic/components/core/form';
import { removeNullUndefined } from '@/generic/helpers/genral';

import JsonFormComp from './jsonFormComp';

interface Props {
  triggerModal?: () => void;
  setAction?: (data?: any) => void;
  UPDATE?: any;
  ADD?: any;
  current?: any | null;
  param?: any | null;
  data?: any | null;
  formProps?: FormProps;
  formRef?: any;
  addCustomValues?: any;
  onSuccess?: () => void;
  submitStyleTw?: string;
  onFinish?: (data?: any) => void;
  onSumbit?: (data?: any) => void;
  AddId?: string | number;
  addToUpdateParams?: any;
  updateParamDataType?: any;
  updateData?: any;
  onUpdateModalOpen?: (data?: any) => void;
  customOnFinish?: (data?: any) => void;
  afterOnFinish?: (data?: any) => void;
  uiSchema?: any;
  jsFormProps?: JSFormProps;
  getJsonFormDataAdd?: any;
  getJsonFormDataUpdate?: any;
  getJsonFormDataAddParams?: any;
  getJsonFormDataUpdateParams?: any;
  payloadKey?: string;
}

export default function AddUpdate({
  triggerModal,
  setAction,
  current,
  data,
  UPDATE,
  ADD,
  param,
  formProps,
  formRef,
  addCustomValues,
  submitStyleTw,
  onSuccess,
  onFinish: onFinishProp,
  onSumbit,
  AddId,
  addToUpdateParams,
  updateData: _updateData,
  onUpdateModalOpen,
  customOnFinish,
  jsFormProps,
  getJsonFormDataAdd,
  getJsonFormDataUpdate,
  getJsonFormDataAddParams,
  getJsonFormDataUpdateParams,
  afterOnFinish,
  payloadKey,
}: Props) {
  const form = formRef || Form.useForm()[0];

  useEffect(() => {
    if (current) {
      console.log(current);

      form.setFieldsValue(current);
      onUpdateModalOpen && onUpdateModalOpen(current);
    } else {
      form.resetFields();
    }
  }, [current]);

  const AddFunction = ({ id, vals }: { id?: any; vals?: any }) => {
    function response(res?: any) {
      if (res.status === false) return;

      message.success('Added successfully');
      onSuccess?.();
      form.resetFields();
      setAction?.((prev: any) => !prev);
      triggerModal?.();
      afterOnFinish?.(res);
    }

    const catchErr = (e: any) => console.log(e);

    if (id) {
      return ADD(id, removeNullUndefined({ ...vals, ...param }))
        .then((res: any) => response(res))
        .catch((e: any) => catchErr(e));
    }

    return ADD(
      payloadKey ? removeNullUndefined({ [payloadKey]: vals, ...param }) : removeNullUndefined({ ...vals, ...param }),
    )
      .then((res: any) => response(res))
      .catch((e: any) => catchErr(e));
  };

  const UpdateFunction = ({ updateData, vals }: { updateData?: any; vals?: any }) => {
    const response = (res?: any) => {
      console.log(res);

      if (res && res?.result !== null) {
        message.success('Updated successfully');
        setAction?.((prev: any) => !prev);
        onSuccess?.();
        triggerModal?.();
        afterOnFinish?.(res);
      }
    };

    const catchErr = (e: any) => console.log(e);

    if (addToUpdateParams)
      return UPDATE(updateData)
        .then((res: any) => response(res))
        .catch((e: any) => catchErr(e));

    return UPDATE(current?.id, removeNullUndefined({ ...vals, ...param }), current?.index)
      .then((res: any) => response(res))
      .catch((e: any) => catchErr(e));
  };

  const onFinish = (value: any) => {
    const val = {
      ...addCustomValues,
      ...value,
    };

    const vals = onFinishProp ? onFinishProp(val) : val;

    console.log(vals);

    if (customOnFinish) {
      triggerModal?.();

      return customOnFinish(vals);
    }

    if (
      current?.id > 0 ||
      current?.index > 0 ||
      (current && (jsFormProps || getJsonFormDataAdd || getJsonFormDataUpdate))
    ) {
      const updateData = {
        instanceId: current?.id || current?.index,
        data: removeNullUndefined({ ...vals, ...param }),
        ...addToUpdateParams,
      };

      console.log(updateData);

      return UpdateFunction({ updateData, vals });
    }

    AddFunction({ vals, id: AddId });
  };

  if (jsFormProps || getJsonFormDataAdd || getJsonFormDataUpdate) {
    return (
      <JsonFormComp
        onFinish={onFinish}
        current={current}
        jsFormProps={jsFormProps}
        getJsonFormDataAdd={getJsonFormDataAdd}
        getJsonFormDataUpdate={getJsonFormDataUpdate}
        getJsonFormDataAddParams={getJsonFormDataAddParams}
        getJsonFormDataUpdateParams={getJsonFormDataUpdateParams}
      />
    );
  }

  return (
    <MyForm
      submitStyleTw={submitStyleTw}
      onFinish={onFinish}
      showSubmit
      options={current && _updateData ? _updateData : data}
      form={form}
      layout="vertical"
      onSumbit={onSumbit}
      {...formProps}
    />
  );
}
