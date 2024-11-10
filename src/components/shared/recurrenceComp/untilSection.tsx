import { DatePicker, Form, InputNumber, Radio } from 'antd';

import { useLocale } from '@/locales';

interface Props {
  handleEndChange: (data: any) => void;
  endType: any;
}

export default function UntilSection({ endType, handleEndChange }: Props) {
  const { formatMessage } = useLocale();

  return (
    <Form.Item name="until" required>
      <Radio.Group onChange={handleEndChange} className="flex flex-col space-y-5" value={endType}>
        <div className="flex flex-row space-x-5 items-center">
          <Radio value="onDate">{formatMessage({ id: 'general.on' })}</Radio>
          {endType === 'onDate' && (
            <Form.Item name="onDate" noStyle required>
              <DatePicker showTime className="ml-4" />
            </Form.Item>
          )}
        </div>

        <div className="flex flex-row space-x-5 items-center">
          <Radio value="after">{formatMessage({ id: 'general.after' })}</Radio>
          {endType === 'after' && (
            <Form.Item name="count" noStyle required>
              <InputNumber min={1} className="ml-4 min-w-[120px]" placeholder="occurrences" />
            </Form.Item>
          )}
        </div>
      </Radio.Group>
    </Form.Item>
  );
}
