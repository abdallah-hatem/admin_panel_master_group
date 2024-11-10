// FormRow.tsx
import type { MyFormItemProps } from '@/generic/components/core/form-item';
import type { RowProps } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

import MyFormItem from '@/generic/components/core/form-item';
import AddUpdate from '@/generic/components/crudTable/addUpdate';
import useModal from '@/generic/hooks/useModal';
import useSelectAfter from '@/generic/hooks/useSelecetAfter';

import MyButton from '../../basic/button';
import TableFormItem from '../tableFormItem';

interface FormRowProps {
  fields: MyFormItemProps[];
  colProps?: { span: number; offset?: number }[];
  rowProps?: RowProps;
}

const FormRow: React.FC<FormRowProps> = ({ fields, colProps, rowProps }) => {
  const { showModal, renderModal, hideModal } = useModal({ modalProps: { footer: null } });

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Row gutter={16} {...rowProps} {...fields[0]?.rowProps}>
      {fields.map((field: any, index) => {
        if (field.addAfter) {
          const data = {
            innerProps: {
              addonAfter: useSelectAfter({
                data: field.addAfter,
                defaultValue: field.addAfter.defaultValue,
                disabled: field.addAfter.disabled,
              }),
            },
            ...field,
          };

          return (
            <Col key={field.name as string} {...(colProps ? colProps[index] : { span: 24 / fields.length })}>
              <MyFormItem {...data} />
              <MyFormItem
                name={field.addAfter.name}
                initialValue={field.addAfter.defaultValue}
                hidden
                required={true}
              />
            </Col>
          );
        }

        if (field?.formTableData) return <TableFormItem key={index} formData={field.formTableData} />;

        return (
          <Col
            key={field.name as string}
            // {...(colProps ? colProps[index] : { span: 24 / fields.length })}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            {...(fields[0]?.colProps ? fields[0]?.colProps[index] : { span: 24 / fields.length })}
          >
            {field?.createFormData?.length > 0 ? (
              <FormWithAdd field={field} index={index} />
            ) : (
              <MyFormItem {...field} />
            )}
          </Col>
        );
      })}
    </Row>
  );

  function MyCustomBtn({ field }: { field: any }) {
    return (
      <MyButton
        className="mt-2"
        icon={<PlusOutlined />}
        onClick={() =>
          showModal(
            <AddUpdate
              triggerModal={hideModal}
              ADD={field?.create}
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
        <MyFormItem key={index} {...field} className="w-full" customButton={<MyCustomBtn field={field} />} />

        {renderModal()}
      </div>
    );
  }
};

export default FormRow;
