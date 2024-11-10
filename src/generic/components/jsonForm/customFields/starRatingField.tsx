import type { FieldProps } from '@rjsf/utils';

import { Rate } from 'antd';
import { useEffect, useState } from 'react';

interface Props extends FieldProps {}

export default function StarRatingField({ schema, onChange, formData }: Props) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (formData) {
      setVal(formData);
    } else {
      setVal(0);
    }
  }, [formData]);

  return (
    <div className="mt-[6px] flex flex-col">
      <label className="mb-5">{schema.title ?? 'Rating'}</label>
      <Rate
        value={val}
        onChange={e => {
          onChange(String(e));
          setVal(e);
        }}
      />
    </div>
  );
}
