import type { schemeType } from '@/generic/components/core/form';

import { Form, message } from 'antd';
import { useParams } from 'react-router-dom';

import { ADD_EVENT_COMMENTS } from '@/generic/api/events';
import MyForm from '@/generic/components/core/form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import RichTextEditor from '@/generic/components/core/RichTextEditor';

export default function AddComment() {
  const [form] = Form.useForm();
  const { id } = useParams();

  const data: schemeType[] = [
    {
      name: 'comment',
      required: false,
      children: (
        <RichTextEditor
          onChange={(data: any) => {
            form.setFieldsValue({ comment: data });
          }}
          // focused={true}
          // value={form.getFieldValue('comment')}
        />
      ),
    },
  ];

  function onFilterSubmit(value: any) {
    console.log(value);

    const { comment: val } = value;

    id &&
      ADD_EVENT_COMMENTS(id, val).then((res: any) => {
        console.log(res);

        if (res.status === false) return;

        message.success('Comment added successfully');
        form.resetFields();
      });
  }

  return <MyForm showSubmit options={data} layout="vertical" form={form} onFinish={onFilterSubmit} />;
}
