import { DeleteFilled } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GET_ACTIVITY_OPTIONS_SUGGESTIONS } from '@/api/activities';
import { EnumKeys } from '@/api/enums';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import useEnum from '@/generic/hooks/useEnum';
import useFetch from '@/generic/hooks/useFetch';
import { useLocale } from '@/locales';

const { Option } = Select;

interface Props {
  formRef?: any;
  options?: any[];
  customOnFinish?: (data: any, type: 'add' | 'update', recurrenceId?: number | string) => void;
  activityData?: any;
  createdActivityId?: string | number;
  currentIndex: number | string;
  onRemove?: (index: number | string, data: any) => void;
}

const RecurrenceFormOptions = ({
  formRef: _formRef,
  options,
  customOnFinish,
  activityData,
  createdActivityId,
  currentIndex,
  onRemove,
}: Props) => {
  const formRef = _formRef || Form.useForm()[0];

  const [endType, setEndType] = useState<string | null>(null);
  const [frequencyValue, setFrequencyValue] = useState<string | null>(null);

  const { data: timeUnits } = useEnum({ enumKey: EnumKeys.TimeUnits });

  const { id } = useParams();

  const { data: activityOptionsSuggestions } = useFetch<any>({
    GET: GET_ACTIVITY_OPTIONS_SUGGESTIONS,
    params: { activity_id: id || activityData?.id || createdActivityId },
  });

  const { formatMessage } = useLocale();

  console.log(activityData);

  useEffect(() => {
    if (activityData) {
      console.log(activityData);
      const {
        frequency,
        interval,
        dtstart,
        until,
        dtend,
        byweekday,
        count,
        activity_options_ids,
        duration,
        duration_unit,
      } = activityData;

      formRef.setFieldsValue({
        frequency,
        interval,
        dtstart: dayjs(dtstart),
        until: dayjs(until),
        dtend: dayjs(dtend),
        byweekday: byweekday?.map((w: any) => String(w)),
        count,
        activity_options_ids,
        duration,
        duration_unit,
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

  const onFinish = async (data: any) => {
    console.log(data);

    const errors: any[] = [];

    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null || data[key] === '' || data[key].length === 0) {
        // Push the field error into the errors array if the value is undefined or null
        errors.push({
          name: key,
          errors: [`${key} is required`], // Customize the error message here
        });
      } else {
        // Clear the error for the field if it's valid
        errors.push({
          name: key,
          errors: [], // Empty array clears the error
        });
      }
    });

    if (errors.length > 0) {
      // Set the validation errors or clear errors for all fields
      formRef.setFields(errors);

      // Stop form submission if there are any validation errors
      const hasErrors = errors.some(error => error.errors.length > 0);

      if (hasErrors) {
        return;
      }
    }

    // customOnFinish?.(data, activityData ? 'update' : 'add', activityData?.id);
  };

  return (
    <CardComp styleTw="min-w-[600px]">
      <div className="flex justify-end" onClick={() => onRemove?.(currentIndex, activityData)}>
        <DeleteFilled style={{ color: 'red' }} className="text-xl cursor-pointer" />
      </div>
      <MyForm
        form={formRef}
        name="customFrequency"
        layout="vertical"
        className="space-y-4"
        onFinish={onFinish}
        validateMessages={{
          required: 'This field is required!',
        }}
      >
        <Form.Item name="activity_options_ids" label="Activity option" required>
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
          {/*<Form.Item label={formatMessage({ id: 'general.ends_on' })} name="dtend" required>
            <DatePicker showTime className="" />
          </Form.Item>*/}

          <Form.Item label={formatMessage({ id: 'general.ends_after' })} name="duration" required>
            <Input
              type="number"
              className="w-[250px]"
              addonAfter={
                <Form.Item
                  name="duration_unit"
                  rules={[{ required: true, message: 'Please input the duration unit!' }]}
                  // noStyle
                  className="w-[100px] p-0 !h-[5px]"
                >
                  <Select placeholder="Unit">
                    {timeUnits?.map((el: any) => (
                      <Select.Option key={el.id} value={el.id}>
                        {el.suggestion}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              }
            />
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
            {activityData ? formatMessage({ id: 'general.update' }) : formatMessage({ id: 'general.submit' })}
          </Button>
        </Form.Item>
      </MyForm>
    </CardComp>
  );
};

export default RecurrenceFormOptions;
