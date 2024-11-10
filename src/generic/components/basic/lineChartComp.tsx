import { Line } from '@ant-design/plots';

interface Props {
  data: any;
}

export default function LineChartComp({ data }: Props) {
  const { data: _data, ...rest } = data ?? {};

  console.log(_data);
  console.log({ ...rest });

  return (
    <Line
      data={_data}
      height={300}
      seriesField="name"
      {...rest}
      // xField={(d: any) => new Date(d.year)}
      // yField="value"
      // sizeField="value"
      // shapeField="trail"
      // legend={{ size: false }}
      // colorField="category"
    />
  );
}
