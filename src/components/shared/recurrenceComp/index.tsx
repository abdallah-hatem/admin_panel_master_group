import { DeleteFilled } from '@ant-design/icons';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GET_ACTIVITY_OPTIONS_SUGGESTIONS } from '@/api/activities';
import CardComp from '@/generic/components/basic/cardComp';
import MyForm from '@/generic/components/core/form';
import useFetch from '@/generic/hooks/useFetch';
import { useLocale } from '@/locales';

import { useAddFormData } from './forms/add';

interface Props {
  activityData?: any;
  onRemove?: (index: number | string, data: any) => void;
  currentIndex: number | string;
  customOnFinish?: (data: any, type: 'add' | 'update', recurrenceId?: number | string) => void;
  activityOptionsSuggestions: any[];
  removeDelete?: boolean;
}

export default function RecurrenceComp({
  activityData,
  onRemove,
  currentIndex,
  customOnFinish,
  activityOptionsSuggestions,
  removeDelete = false,
}: Props) {
  const formRef = Form.useForm()[0];

  const { formatMessage } = useLocale();

  const [endType, setEndType] = useState<any>(null);
  const [currentDates, setCurrentDates] = useState<any>(null);

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
        byweekday: byweekday?.map((el: any) => String(el)),
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

      setCurrentDates(
        getStartAndEndDate({
          dtstart: activityData.dtstart,
          duration: Number(activityData.duration),
          duration_unit: activityData.duration_unit,
        }),
      );
    }
  }, [activityData]);

  const handleEndChange = (e: any) => setEndType(e.target.value);

  const formData = useAddFormData({
    formRef,
    endType,
    handleEndChange,
    activityOptionsSuggestions,
    getStartAndEndDate: currentDates,
  });

  const onFinish = async () => {
    const errors: any[] = [];
    const data = await formRef.getFieldsValue();

    console.log(data);

    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null || data[key] === '' || data[key].length === 0) {
        // Push the field error into the errors array if the value is undefined or null
        console.log(key);

        if (key === 'byweekday' && data?.frequency !== 'weekly') return;

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

    console.log(errors);

    if (errors.length > 0) {
      // Set the validation errors or clear errors for all fields
      formRef.setFields(errors);

      // Stop form submission if there are any validation errors
      const hasErrors = errors.some(error => error.errors.length > 0);

      if (hasErrors) return;
    }

    console.log(data);

    customOnFinish?.(data, activityData ? 'update' : 'add', activityData?.id);
  };

  function handleValuesChange() {
    const _data = formRef.getFieldsValue();

    if (_data.dtstart && _data.duration && _data.duration_unit)
      return setCurrentDates(
        getStartAndEndDate({
          dtstart: _data.dtstart,
          duration: Number(_data.duration),
          duration_unit: _data.duration_unit,
        }),
      );

    setCurrentDates(null);
  }

  const getStartAndEndDate = ({
    dtstart,
    duration,
    duration_unit,
  }: {
    dtstart: any;
    duration: number;
    duration_unit: any;
  }) => {
    let startDate;

    // Check if dtstart is an object or a string
    if (typeof dtstart === 'object' && dtstart['$d']) {
      // Convert the complex object to a dayjs object
      startDate = dayjs(dtstart['$d']);
    } else if (typeof dtstart === 'string') {
      // If it's already a string, parse it directly
      startDate = dayjs(dtstart);
    } else {
      throw new Error('Invalid dtstart format');
    }

    // Add the duration to the start date based on the duration_unit
    const endDate = startDate.add(duration, duration_unit);

    return {
      startDate: startDate.format('YYYY-MM-DD HH:mm:ss'), // Format as needed
      endDate: endDate.format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  return (
    <>
      {!removeDelete && (
        <div className="flex justify-end" onClick={() => onRemove?.(currentIndex, activityData)}>
          <DeleteFilled style={{ color: 'red' }} className="text-xl cursor-pointer" />
        </div>
      )}
      <MyForm
        onValuesChange={handleValuesChange}
        form={formRef}
        name="customFrequency"
        layout="vertical"
        className="space-y-4 h-full flex flex-col"
        onSumbit={onFinish}
        options={formData}
        showSubmit
        submitStyleContainerTw="flex flex-col justify-end h-full"
        submitStyleTw="w-full"
        submitText={activityData ? formatMessage({ id: 'general.update' }) : formatMessage({ id: 'general.submit' })}
      />
    </>
  );
}
