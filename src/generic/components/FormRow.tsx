import type { MyFormItemProps } from '@/generic/components/core/form-item';

import { Col, Row } from 'antd';
import React from 'react';

import MyFormItem from '@/generic/components/core/form-item';

interface FormRowProps {
  fields: MyFormItemProps[];
  colProps?: { span: number; offset?: number }[];
}

const FormRow: React.FC<FormRowProps> = ({ fields, colProps }) => {
  return (
    <Row gutter={16}>
      {fields.map((field, index) => (
        <Col key={field.name as string} {...(colProps ? colProps[index] : { span: 24 / fields.length })}>
          <MyFormItem {...field} />
        </Col>
      ))}
    </Row>
  );
};
