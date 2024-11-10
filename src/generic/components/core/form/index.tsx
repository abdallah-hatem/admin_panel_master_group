/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { FormTableProps } from '../dynamicFormRows';
import type { ControlTypes, InnerProps, MyFormItemProps } from '../form-item';
import type { FormListProps } from '../formList';
import type { FormRule, RowProps } from 'antd';
import type { FormProps } from 'antd/es/form/Form';

import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { Fragment } from 'react/jsx-runtime';

import AddUpdate from '@/generic/components/crudTable/addUpdate';
import useModal from '@/generic/hooks/useModal';
import useSelectAfter from '@/generic/hooks/useSelecetAfter';

import MyButton from '../../basic/button';
import DynamicFormRows from '../dynamicFormRows';
import MyFormItem from '../form-item';
import FormRow from '../form-row';
import FormListComp from '../formList';
// import TableFormItem from '../tableFormItem';

export interface MyFormOptions extends Array<MyFormItemProps<ControlTypes>> {}

export interface MyFormProps<T> extends FormProps<T> {
  options?: MyFormOptions | schemeType[];
  showSubmit?: boolean;
  submitText?: string;
  submitStyleTw?: string;
  submitStyleContainerTw?: string;
  isTableForm?: boolean;
  onSumbit?: (data?: any) => void;
}

// type _FormItems = MyFormItemProps<ControlTypes>;

type _schemeType = {
  key?: string;
  label?: ReactNode;
  name?: string | any;
  type?: ControlTypes;
  options?: {
    label: string;
    value: any;
  }[];
  innerProps?: InnerProps[T];
  required?: string | boolean;
  dependencies?: string[];
  shouldShow?: (values: any) => boolean;
  className?: string;
  rules?: FormRule[];
  children?: React.ReactNode;
  hidden?: boolean;
  formTableData?: FormDataGenerator;
  formTableProps?: FormTableProps;
  create?: any;
  createFormData?: schemeType[];
  onCreateSuccess?: () => void;
  onFinish?: (data: any) => void;
  dependencies?: any[];
  tooltip?: string;
  addAfter?: {
    name: string;
    placeHolder: string;
    data: any[];
    formRef?: any;
    defaultValue?: any;
    disabled?: boolean;
    innerProps?: InnerProps[T];
    key?: string;
    onChange?: (data) => void;
    required?: boolean;
    label?: string;
    rules?: FormRule[];
  };
  rowProps?: RowProps;
  colProps?: { span: number; offset?: number }[];
  formListData?: any;
  formListProps?: FormListProps;
  formRef?: any;
  rules?: FormRule[];
};

export type schemeType = _schemeType | _schemeType[];

export type FormDataGenerator = (field: any) => schemeType;

const BaseForm = <Values extends object>(props: MyFormProps<Values>) => {
  const {
    options,
    children,
    showSubmit = false,
    submitText,
    submitStyleTw,
    submitStyleContainerTw,
    // isTableForm = false,
    onSumbit,
    ...rest
  } = props;

  const { showModal, renderModal, hideModal } = useModal({ modalProps: { footer: null } });

  return (
    <Form<Values> {...rest}>
      {options?.map((option: _schemeType, index) => {
        console.log(option);

        if (option.length > 0) return <FormRow key={index} fields={option} />;

        if (option?.formTableData)
          return (
            <DynamicFormRows
              key={index}
              name={option.name}
              label={option.label}
              formTableProps={option.formTableProps}
              data={option.formTableData}
            />
          );

        if (option?.formListData) {
          return (
            <FormListComp
              formListData={option.formListData}
              key={index}
              formListProps={option?.formListProps}
              formRef={option?.formRef}
            />
          );
        }

        if (option.addAfter) return addAfterForm(option, index);

        if (option?.createFormData?.length > 0) return <FormWithAdd field={option} index={index} />;

        return <MyFormItem key={index} {...option} />;
      })}
      {children}

      {showSubmit && (
        <MyFormItem className={submitStyleContainerTw}>
          <MyButton type="primary" htmlType="submit" className={submitStyleTw} onClick={onSumbit}>
            {submitText ?? 'Submit'}
          </MyButton>
        </MyFormItem>
      )}
    </Form>
  );

  function addAfterForm(option, index) {
    const data = {
      innerProps: {
        addonAfter: useSelectAfter({
          data: option.addAfter,
          defaultValue: option.addAfter.defaultValue,
          disabled: option.addAfter.disabled,
        }),
      },
      ...option,
    };

    return (
      <Fragment key={index}>
        <MyFormItem {...data} />
        <MyFormItem
          name={option.addAfter.name}
          initialValue={option.addAfter.defaultValue}
          innerProps={option.addAfter.innerProps}
          required={true}
          hidden
        />
        {/*  hidden input for addAfter */}
      </Fragment>
    );
  }

  function AddButton({ field }: { field: any }) {
    return (
      <MyButton
        className="mt-2"
        icon={<PlusOutlined />}
        onClick={() =>
          showModal(
            <AddUpdate
              triggerModal={hideModal}
              ADD={field?.create}
              customOnFinish={field?.onFinish}
              data={field?.createFormData}
              onSuccess={field?.onCreateSuccess}
            />,
            700,
          )
        }
      />
    );
  }

  function FormWithAdd({ field, index }: { field: any; index: number }) {
    return (
      <div className="flex items-center gap-4" key={index}>
        <MyFormItem key={index} {...field} className="w-full" customButton={<AddButton field={field} />} />

        {renderModal()}
      </div>
    );
  }
};

const MyForm = Object.assign(BaseForm, Form, { Item: MyFormItem });

export default MyForm;
