import useFetch from '@/generic/hooks/useFetch';

type Res = {
  id: number;
  sugesstion: string;
};

export default function SchemaFromApi(api: any) {
  const { data } = useFetch<Res[]>({ GET: api });

  const enumValues = data?.map(item => item.id);

  // Return the desired schema
  return enumValues;
}
