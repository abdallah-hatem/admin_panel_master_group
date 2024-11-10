import { notification } from 'antd';

const useFormSubmit = (submitFunction: any, onSuccess: any, onError: any) => {
  const onSubmit = async (form: any, additionalArgs = {}) => {
    try {
      const values = await form.validateFields();
      const res = await submitFunction({ ...values, ...additionalArgs });

      if (res.status) {
        notification.success({
          message: 'Success',
          description: 'Your request was successful.',
          placement: 'bottomRight',
        });
        onSuccess?.();
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an issue with your request.',
        placement: 'bottomRight',
      });
      onError?.(error);
    }
  };

  return onSubmit;
};

export default useFormSubmit;
