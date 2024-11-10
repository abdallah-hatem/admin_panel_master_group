import { ApiBaseUrl, request } from '@/generic/api/request';

// Examples

// Define individual request functions
export const GET_UNITS = (params?: any) => request<any>('get', ApiBaseUrl + '/enums/units', params);

export const GET_STARS = (params?: any) => request<any>('get', ApiBaseUrl + '/enums/stars', params);

// Define an enum for the keys
export enum EnumKeys {
  Units = 'units',
  Stars = 'stars',
}

// Enum mapper
const enumMapper: { [key in EnumKeys]: (params?: any) => any } = {
  [EnumKeys.Units]: GET_UNITS,
  [EnumKeys.Stars]: GET_STARS,
};

// General request function based on enum string
export const GET_ENUM_MAPPER_REQUEST = (enumKey: EnumKeys, params?: any) => {
  const requestFunction = enumMapper[enumKey];

  if (requestFunction) {
    return requestFunction(params);
  } else {
    throw new Error(`Invalid enum key: ${enumKey}`);
  }
};
