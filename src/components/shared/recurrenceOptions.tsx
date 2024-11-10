import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, InputNumber, Radio, Select, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { GET_ACTIVITY_OPTIONS_SUGGESTIONS } from '@/api/activities';
import CardComp from '@/generic/components/basic/cardComp';
import useFetch from '@/generic/hooks/useFetch';
import { useLocale } from '@/locales';

const { Option } = Select;

interface Props {
  formRef?: any;
  options?: any[];
  customOnFinish?: (data: any) => void;
  activityData?: any;
  createdActivityId?: string | number;
}

const RecurrenceOptions = ({ formRef, options, customOnFinish, activityData, createdActivityId }: Props) => {
  const [endTypes, setEndTypes] = useState<{ [key: number]: string | null }>({});
  const { formatMessage } = useLocale();

  const { data: activityOptionsSuggestions } = useFetch<any>({
    GET: GET_ACTIVITY_OPTIONS_SUGGESTIONS,
    params: { activity_id: activityData?.id || createdActivityId },
  });

  console.log(activityOptionsSuggestions);

  useEffect(() => {
    if (activityData) {
      console.log(activityData);

      const { recurrences } = activityData;

      formRef.setFieldsValue({
        recurrences: recurrences?.map((el: any, index: number) => {
          if (el.count) {
            setEndTypes(prev => ({ ...prev, [index]: 'after' }));
          } else {
            setEndTypes(prev => ({ ...prev, [index]: 'onDate' }));
          }

          return {
            frequency: el.frequency,
            interval: el?.interval,
            dtstart: dayjs(el?.dtstart),
            until: el?.count ? 'after' : dayjs(el?.until),
            dtend: dayjs(el?.dtend),
            byweekday: el?.byweekday?.map((w: any) => String(w)),
            count: el?.count,
            activity_options_ids: el?.activity_options_ids,
            id: el?.id,
          };
        }),
      });
    }
  }, [activityData]);

  const handleEndChange = (e: any, index: number) => {
    const { value } = e.target;

    setEndTypes(prev => ({ ...prev, [index]: value }));
  };

  const onFinish = (data: any) => {
    console.log(data);
    customOnFinish?.(data);
  };

  return (
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
      <Form.List name="recurrences">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <CardComp key={key} styleTw="min-w-[600px] mb-5 min-h-[550px]">
                <Form.Item {...restField} name={[name, 'activity_options_ids']} label="Activity option" required>
                  <Select mode="multiple">
                    {activityOptionsSuggestions?.map((el: any) => (
                      <Option value={el.id} key={el.id}>
                        {el.suggestion}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Repeat Every */}
                <Form.Item
                  {...restField}
                  label={formatMessage({ id: 'general.repeat_every' }) ?? 'Repeat every'}
                  className="w-[200px]"
                  name={[name, 'interval']}
                  required
                >
                  <div className="flex items-center space-x-2">
                    <Form.Item name={[name, 'interval']} noStyle required>
                      <InputNumber min={1} className="w-16" />
                    </Form.Item>
                    <Form.Item name={[name, 'frequency']} noStyle required>
                      <Select placeholder="Select" onChange={val => setEndTypes(prev => ({ ...prev, [index]: val }))}>
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
                {(formRef.getFieldValue(['recurrences', index, 'frequency']) || endTypes[index]) === 'weekly' && (
                  <Form.Item
                    label={formatMessage({ id: 'general.repeat_on' }) ?? 'Repeat on'}
                    name={[name, 'byweekday']}
                    required
                  >
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
                  <Form.Item label={formatMessage({ id: 'general.starts_on' })} name={[name, 'dtstart']} required>
                    <DatePicker showTime />
                  </Form.Item>

                  {/* Ends On */}
                  <Form.Item label={formatMessage({ id: 'general.ends_on' })} name={[name, 'dtend']} required>
                    <DatePicker showTime />
                  </Form.Item>
                </div>

                {/* Until */}
                <Form.Item label={formatMessage({ id: 'general.until' })} name={[name, 'until']} required>
                  <Radio.Group
                    onChange={e => handleEndChange(e, index)}
                    className="flex flex-col space-y-5"
                    value={endTypes[index]}
                  >
                    <div className="flex flex-row space-x-5 items-center">
                      <Radio value="onDate">{formatMessage({ id: 'general.on' })}</Radio>
                      {endTypes[index] === 'onDate' && (
                        <Form.Item name={[name, 'onDate']} noStyle>
                          <DatePicker showTime className="ml-4" />
                        </Form.Item>
                      )}
                    </div>

                    <div className="flex flex-row space-x-5 items-center">
                      <Radio value="after">{formatMessage({ id: 'general.after' })}</Radio>
                      {endTypes[index] === 'after' && (
                        <Form.Item name={[name, 'count']} noStyle>
                          <InputNumber min={1} className="ml-4 min-w-[120px]" placeholder="occurrences" />
                        </Form.Item>
                      )}
                    </div>
                  </Radio.Group>
                </Form.Item>

                {/* Remove Button */}
                <MinusCircleOutlined onClick={() => remove(name)} className="cursor-pointer" />
              </CardComp>
            ))}

            {/* Add Button */}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                disabled={fields.length === activityOptionsSuggestions?.length}
              >
                Add Another Recurrence
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full mt-5">
          {formatMessage({ id: 'general.submit' })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RecurrenceOptions;
