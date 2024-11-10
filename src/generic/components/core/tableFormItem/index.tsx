import type { schemeType } from '../form';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';

import MyForm from '../form';

interface Props {
  formData: (field: any) => schemeType[];
}

const TableFormItem = ({ formData }: Props) => {
  function createFormItems(field: any) {
    console.log(formData(field));

    return formData(field)?.map((item: any, index) => {
      console.log(item);

      return <MyForm key={index} isTableForm={true} options={item} />;
    });
  }

  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
          <Card size="small" title={`create item`} key={2}>
            {fields.map(field => (
              <div className="flex justify-between items-center" key={field.key}>
                {createFormItems(field)}

                <Button onClick={() => remove(field.name)}>
                  <CloseOutlined />
                </Button>
              </div>
            ))}
          </Card>

          <Button type="dashed" onClick={() => add()} block>
            + Add Item
          </Button>
        </div>
      )}
    </Form.List>
  );
};

export default TableFormItem;
