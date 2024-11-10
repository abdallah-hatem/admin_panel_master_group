import { Pie } from '@ant-design/plots';

interface Props {
  data: any;
}

export default function PieChartComp({ data }: Props) {
  console.log(data);

  const { data: _data, ...rest } = data ?? {};

  return (
    data && (
      <Pie
        data={_data}
        width={600}
        height={250}
        {...rest}
        // angleField={'value'}
        // colorField={'suggestion'}
        label={{ text: 'value', style: { fontWeight: 'bold' } }}
        legend={{
          color: {
            title: false,
            position: 'right',
          },
        }}
      />
    )
  );
}
