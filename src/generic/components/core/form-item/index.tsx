// MyFormItem.tsx
import type { TreeSelect } from 'antd';
import type { FormItemProps } from 'antd/es/form';
import type { FC, ReactNode } from 'react';

import { Checkbox, ColorPicker, DatePicker, Form, Input, InputNumber, Radio, Rate, Select, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import React, { useMemo } from 'react';

import MyTreeSelect from '@/generic/components/basic/treeSelect';

export type ControlTypes =
  | 'input'
  | 'input-number'
  | 'switch'
  | 'date-picker'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'range-date-picker'
  | 'colorPicker'
  | 'rating'
  | 'tree-select';

type GetRCPropsType<T> = T extends (props: infer R) => any ? R : T extends React.ComponentClass<infer R> ? R : any;

export type InnerProps = {
  input: GetRCPropsType<typeof Input>;
  'input-number': GetRCPropsType<typeof InputNumber>;
  switch: GetRCPropsType<typeof Switch>;
  'date-picker': GetRCPropsType<typeof DatePicker>;
  checkbox: GetRCPropsType<typeof Checkbox>;
  radio: GetRCPropsType<typeof Radio>;
  select: GetRCPropsType<typeof Select>;
  textarea: GetRCPropsType<typeof Input>;
  colorPicker: GetRCPropsType<typeof ColorPicker>;
  'range-date-picker': GetRCPropsType<typeof DatePicker>;
  'tree-select': GetRCPropsType<typeof TreeSelect>;
  rating: GetRCPropsType<typeof Rate>;
};

export interface MyFormItemProps<T extends ControlTypes = ControlTypes> extends Omit<FormItemProps, 'required'> {
  type?: T;
  options?:
    | {
        label: string;
        value: any;
        disabled?: boolean;
      }[]
    | any;
  innerProps?: InnerProps[T];
  required?: string | boolean;
  dependencies?: string[];
  shouldShow?: (values: any) => boolean;
  customButton?: ReactNode;
}

const { RangePicker } = DatePicker;

export class ControlMap {
  props: MyFormItemProps;

  constructor(props: MyFormItemProps) {
    this.props = props;
  }

  get innerProps() {
    return this.props.innerProps as object;
  }

  input() {
    return <Input {...this.innerProps} />;
  }

  'input-number'() {
    return <InputNumber {...this.innerProps} type="number" changeOnWheel={false} controls={false} />;
  }

  switch() {
    return <Switch {...this.innerProps} />;
  }

  'date-picker'() {
    return <DatePicker {...this.innerProps} />;
  }

  'range-date-picker'() {
    return <RangePicker {...this.innerProps} />;
  }

  checkbox() {
    return <Checkbox.Group options={this.props.options} {...this.innerProps} />;
  }

  radio() {
    return <Radio.Group options={this.props.options} {...this.innerProps} />;
  }

  select() {
    return <Select showSearch optionFilterProp="label" options={this.props.options} {...this.innerProps} />;
  }

  textarea() {
    return <Input.TextArea {...this.innerProps} />;
  }

  colorPicker() {
    return <ColorPicker {...this.innerProps} defaultValue="#1677ff" />;
  }

  'tree-select'() {
    return <MyTreeSelect {...this.innerProps} />;
  }

  rating() {
    return <Rate {...this.innerProps} />;
  }
}

const MyFormItem: FC<MyFormItemProps> = props => {
  const { type, required, rules: userRules, dependencies, shouldShow, customButton, ...restProps } = props;
  const form = Form.useFormInstance();
  const dependentValues = useWatch(dependencies, form);

  const dependencyValuesObject = useMemo(() => {
    if (!dependencies) return {};

    return dependencies.reduce(
      (acc, dep) => {
        acc[dep] = form.getFieldValue(dep);

        return acc;
      },
      {} as Record<string, any>,
    );
  }, [dependencies, dependentValues, form]);

  const rules = useMemo(() => {
    if (userRules) return userRules;

    if (required) {
      if (typeof required === 'boolean') {
        return [{ required: true, message: `Please input ${props.label}` }];
      } else if (typeof required === 'string') {
        return [{ required: true, message: required }];
      }
    }
  }, [required, userRules, props.label]);

  const controlMap = new ControlMap(props);

  if (customButton) {
    return (
      <div className="w-full flex items-center gap-2">
        <Form.Item {...restProps} rules={rules}>
          {type ? controlMap[type]() : props.children}
        </Form.Item>

        {customButton}
      </div>
    );
  }

  return shouldShow === undefined || shouldShow(dependencyValuesObject) ? (
    <Form.Item {...restProps} rules={rules}>
      {type ? controlMap[type]() : props.children}
    </Form.Item>
  ) : null;
};

export default MyFormItem;
