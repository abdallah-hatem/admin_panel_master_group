import type { RootState } from '@/generic/stores';
import type { FieldProps } from '@rjsf/utils';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getDataByRoute } from '@/generic/helpers/jsonForm';

import MyTreeSelect from '../../basic/treeSelect';

interface Props extends FieldProps {}

export default function TreeSelectField({ onChange, uiSchema, formData, content }: Props) {
  const [data, setData] = useState<any>(null);

  const apiRoute = uiSchema?.['ui:apiRoute'];
  const label = uiSchema?.['ui:label'];
  const multiSelect = uiSchema?.['ui:multiSelect'];

  const { createButtonClickCount } = useSelector((state: RootState) => state.form);

  useEffect(() => {
    if (formData) {
      //   setSelectedOption(formData);
    } else {
      //   setSelectedOption(null);
    }
  }, [formData]);

  useEffect(() => {
    if (apiRoute) getDataByRoute({ apiRoute, onFetch: res => setData(res) });
  }, [apiRoute, createButtonClickCount]);

  const handleChange = (data: any) => {
    console.log(data);

    data.length > 0 && onChange(data[0]);
  };

  return (
    <div>
      <label className="">{label ?? 'Tree Select'}</label>

      <MyTreeSelect
        treeData={data ?? []}
        onChange={e => handleChange(e)}
        treeCheckable
        showCheckedStrategy="SHOW_PARENT"
        treeLine
        showSearch
        className="mt-5"
        multiple={multiSelect ?? false}
      />
    </div>
  );
}

// usage

// const schema = {
//     properties: {
//       telephone: {
//         type: 'string',
//         title: 'Telephone',
//         minLength: 10,
//       },
//     },
//   };

//   const uiSchema = {
//     telephone: {
//       'ui:field': 'TreeSelectField',
//       'ui:apiRoute': 'suggestions/categories_tree',
//       'ui:label': 'Telephone',
//       'ui:multiSelect': true,
//     },
//   };
