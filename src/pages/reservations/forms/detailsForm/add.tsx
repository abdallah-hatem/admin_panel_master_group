interface Props {
  formRef?: any;
  options: any[];
}

const useDetailsFormData = ({ formRef, options }: Props) => {
  const formData: any = (field: any) => [
    {
      key: field.key,
      label: 'Schedule Price',
      name: [field.name, 'schedule_price_id'],
      type: 'select',
      required: true,
      options,
      innerProps: { className: 'min-w-[250px]' },
    },
    {
      key: field.key,
      label: 'Number of people',
      name: [field.name, 'number_of_people'],
      type: 'input',
      required: true,
      innerProps: { className: 'min-w-[250px]', type: 'number' },
    },
  ];

  return formData;
};

export default useDetailsFormData;
