import type { EnumKeys } from '@/api/enums';

import { useEffect, useState } from 'react';

import { GET_ENUM_MAPPER_REQUEST } from '@/api/enums'; // Make sure this import path is correct

interface Props {
  enumKey: EnumKeys;
  params?: any;
  dependencies?: any[];
}

const useEnum = ({ enumKey, params, dependencies = [] }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const getData = async () => {
    setLoading(true);
    GET_ENUM_MAPPER_REQUEST(enumKey, params)
      .then((res: any) => setData(res))
      .catch((err: any) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, [...dependencies]);

  const refetch = () => getData();

  return { data, loading, error, refetch };
};

export default useEnum;
