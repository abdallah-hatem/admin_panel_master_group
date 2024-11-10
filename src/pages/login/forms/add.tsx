import type { schemeType } from '@/generic/components/core/form';

const useAddForm = () => {
  const userData: schemeType[] = [
    [
      {
        label: 'First name',
        name: 'first_name',
        type: 'input',
        required: true,
      },
      {
        label: 'Last name',
        name: 'last_name',
        type: 'input',
        required: true,
      },
    ],
    {
      label: 'Email',
      name: 'email',
      type: 'input',
      required: true,
    },
    {
      label: 'Password',
      name: 'password',
      type: 'input',
      required: true,
      innerProps: {
        type: 'password',
      },
    },
  ];

  const companyData: schemeType[] = [
    {
      label: 'Company name',
      name: 'name',
      type: 'input',
      required: true,
    },
  ];

  const paymentData: schemeType[] = [
    {
      label: 'Payment Method',
      name: '_type',
      type: 'select',
      options: [{ label: 'Bank Transfer', value: 'bank_transfer' }],
      required: true,
    },
    {
      label: 'IBAN',
      name: 'iban',
      type: 'input',
      required: true,
    },
    {
      label: 'SWIFT',
      name: 'swift',
      type: 'input',
      required: true,
    },
    {
      label: 'Beneficiary Name',
      name: 'beneficiary_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank City',
      name: 'bank_city',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank Name',
      name: 'bank_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Bank Address',
      name: 'bank_address',
      type: 'input',
      required: true,
    },
  ];

  const billingData: schemeType[] = [
    {
      label: 'VAT Number',
      name: 'vat_number',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Address',
      name: 'billing_address',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Name',
      name: 'billing_name',
      type: 'input',
      required: true,
    },
    {
      label: 'Billing Country',
      name: 'billing_country',
      type: 'input',
      required: true,
    },
  ];

  return {
    userData,
    companyData,
    paymentData,
    billingData,
  };
};

export default useAddForm;
