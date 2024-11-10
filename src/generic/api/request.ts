import type { AxiosRequestConfig, Method } from 'axios';

import { message as $message } from 'antd';
import axios from 'axios';

import { history } from '@/generic/routes/history';
import store from '@/generic/stores';
import { setGlobalState } from '@/generic/stores/global.store';

import { formatErrors } from '../helpers/genral';

const axiosInstance = axios.create({
  timeout: 6000,
});

axiosInstance.interceptors.request.use(
  config => {
    store.dispatch(
      setGlobalState({
        loading: true,
      }),
    );

    return config;
  },
  error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );

    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );

    if (config?.data?.message) {
      // $message.success(config.data.message)
    }

    return config?.data;
  },
  error => {
    store.dispatch(
      setGlobalState({
        loading: false,
      }),
    );
    // if needs to navigate to login page when request exception
    // history.replace('/login');
    let errorMessage = 'Oops! Something went wrong. Please try again later.';

    console.log(error.response);

    const serverMessage = error?.response?.data?.result?.description;

    const serverErrors = error?.response?.data?.result?.errors;

    if (error?.message?.includes('Network Error')) {
      errorMessage = 'Network Error. Please check your network connection.';
      history.replace('/errorPage');
    } else if (error?.response?.status === 401) {
      history.replace('/login');
      // errorMessage = error?.response?.data?.result.description ?? 'Unauthorized. Please login again.'; // too long description
      errorMessage = 'Unauthorized. Please login again.';
    } else if (error?.response?.status === 403) {
      error?.response?.data?.result?.description !== 'E-mail must be verified' && history.replace('/errorPage/403');
      errorMessage = error?.response?.data?.result.description ?? 'Forbidden. Please contact administrator.';
    } else {
      errorMessage = error?.message;
      // history.replace('/errorPage');
    }

    console.dir(error);
    error.message && $message.error(formatErrors(serverErrors) ?? serverMessage ?? errorMessage);

    return {
      status: false,
      message: errorMessage,
      result: null,
    };
  },
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;

export const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  const configPost = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('t')}`,
    },
    ...config,
  };

  if (method === 'post') {
    return axiosInstance.post(url, data, configPost);
  } else if (method === 'put') {
    return axiosInstance.put(url, data, configPost);
  } else if (method === 'delete') {
    return axiosInstance.delete(url, configPost);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...configPost,
    });
  }
};
