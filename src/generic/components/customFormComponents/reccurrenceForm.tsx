import { Button, Checkbox, DatePicker, Form, InputNumber, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { useLocale } from '@/locales';

import CardComp from '../basic/cardComp';

const { Option } = Select;

interface Props {
  formRef?: any;
  options?: any[];
  customOnFinish?: (data: any) => void;
  activityData?: any;
}

const RecurrenceForm = ({ formRef, options, customOnFinish, activityData }: Props) => {
  const [endType, setEndType] = useState<string | null>(null);
  const [frequencyValue, setFrequencyValue] = useState<string | null>(null);

  const { formatMessage } = useLocale();

  console.log(activityData);

  useEffect(() => {
    if (activityData) {
      console.log(activityData);
      const { frequency, interval, dtstart, until, end_date, byweekday, count } = activityData;

      formRef.setFieldsValue({
        frequency,
        interval,
        dtstart: dayjs(dtstart),
        until: dayjs(until),
        dtend: dayjs(end_date),
        byweekday: byweekday.map((w: any) => String(w)),
        count,
      });

      if (count) {
        setEndType('after');
        formRef?.setFieldsValue({ until: 'after' });
      } else if (until) {
        setEndType('onDate');
        formRef?.setFieldsValue({ until: 'onDate' });
        formRef?.setFieldsValue({ onDate: dayjs(until) });
      }
    }
  }, [activityData]);

  const handleEndChange = (e: any) => {
    setEndType(e.target.value);
  };

  const onFinish = (data: any) => {
    console.log(data);
    customOnFinish?.(data);
  };

  return (
    <CardComp styleTw="min-w-[600px]">
      <Form
        form={formRef}
        name="customFrequency"
        layout="vertical"
        className="space-y-4"
        onFinish={onFinish}
        validateMessages={{
          required: 'This field is required!',
        }}
      >
        {/* Repeat Every */}
        <Form.Item
          label={formatMessage({ id: 'general.repeat_every' }) ?? 'Repeat every'}
          className="w-[150px]"
          name="interval"
          required
        >
          <div className="flex items-center space-x-2">
            <Form.Item name="interval" noStyle required>
              <InputNumber min={1} className="w-16" />
            </Form.Item>
            <Form.Item name="frequency" noStyle required>
              <Select placeholder="Select" onChange={val => setFrequencyValue(val)}>
                {options?.map(el => (
                  <Option value={el.value} key={el.value}>
                    {el.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form.Item>

        {/* Repeat On */}
        {(formRef.getFieldValue('frequency') || setFrequencyValue) === 'weekly' && (
          <Form.Item label={formatMessage({ id: 'general.repeat_on' }) ?? 'Repeat on'} name="byweekday" required>
            <Checkbox.Group>
              <div className="flex space-x-2">
                <Checkbox value="6">S</Checkbox>
                <Checkbox value="0">M</Checkbox>
                <Checkbox value="1">T</Checkbox>
                <Checkbox value="2">W</Checkbox>
                <Checkbox value="3">T</Checkbox>
                <Checkbox value="4">F</Checkbox>
                <Checkbox value="5">S</Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>
        )}

        <div className="flex flex-row items-center justify-between">
          {/* Starts On */}
          <Form.Item label={formatMessage({ id: 'general.starts_on' })} name="dtstart" required>
            <DatePicker showTime className="" />
          </Form.Item>

          {/* Ends On */}
          <Form.Item label={formatMessage({ id: 'general.ends_on' })} name="dtend" required>
            <DatePicker showTime className="" />
          </Form.Item>
        </div>

        {/* Until */}
        <Form.Item label={formatMessage({ id: 'general.until' })} name="until" required>
          <Radio.Group onChange={handleEndChange} className="flex flex-col space-y-5" value={endType}>
            <div className="flex flex-row space-x-5 items-center">
              <Radio value="onDate">{formatMessage({ id: 'general.on' })}</Radio>
              {endType === 'onDate' && (
                <Form.Item name="onDate" noStyle>
                  <DatePicker showTime className="ml-4" />
                </Form.Item>
              )}
            </div>

            <div className="flex flex-row space-x-5 items-center">
              <Radio value="after">{formatMessage({ id: 'general.after' })}</Radio>
              {endType === 'after' && (
                <Form.Item name="count" noStyle>
                  <InputNumber min={1} className="ml-4 min-w-[120px]" placeholder="occurrences" />
                </Form.Item>
              )}
            </div>
          </Radio.Group>
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full mt-5">
            {formatMessage({ id: 'general.submit' })}
          </Button>
        </Form.Item>
      </Form>
    </CardComp>
  );
};

export default RecurrenceForm;
