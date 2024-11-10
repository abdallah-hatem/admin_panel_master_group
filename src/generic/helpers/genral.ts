import { useLocale } from '@/locales';

export function getRandomNumber(min?: number, max?: number): number {
  min = min || 0;
  max = max || 100000;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function countNonNullProperties(obj: any) {
  return Object.keys(obj).filter(key => obj[key] !== null && obj[key] !== undefined).length;
}

//////////////////

export function cleanApiRoute(route: string) {
  //remove the query, <:id> and <:item_id> from the route
  let parsedRoute = route;

  if (parsedRoute.includes('?')) {
    parsedRoute = parsedRoute.split('?')[0];
  }

  if (parsedRoute.includes('<:id>')) {
    parsedRoute = parsedRoute.replace('<:id>', '');
  }

  if (parsedRoute.includes('<:item_id>')) {
    parsedRoute = parsedRoute.replace('<:item_id>', '');
  }

  // remove the numbers from the route
  parsedRoute = parsedRoute
    .split('/')
    .map(segment => {
      if (segment.match(/^\d+$/)) {
        return '';
      }

      return segment;
    })
    .join('/');

  return parsedRoute;
}

export const permissions = JSON.parse(localStorage.getItem('userNavPermissions')!) || [];

export function hasPermission(accessRoutes: string[]): boolean {
  const permissions = JSON.parse(localStorage.getItem('userNavPermissions')!) || [];

  console.log(permissions);

  return accessRoutes.every(el => {
    return permissions.some((el2: any) => el === el2);
  });
}

export const formattedOptions = (options: any, type?: string) => {
  const { formatMessage } = useLocale();

  return options?.map((el: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const formattedLabel = type === 'raw' ? el.label : formatMessage({ id: 'suggestions.' + el.label });

    return { label: formattedLabel, value: el.value };
  });
};

export const transformSuggestionValue = (data: any, key: string) => {
  return data?.map((el: any) => ({
    label: el[key],
    value: el.id,
  }));
};

/**
 *
 * @param data - array of objects
 * @param key - key of the object
 * @param data - string
 */

export const getOptions = (data: any, key?: string, type?: any) => {
  if (key) return formattedOptions(transformSuggestionValue(data, key), 'raw');

  return formattedOptions(transformSuggestionValue(data, 'suggestion'), type);
};

export const formatErrors = (errors: any) => {
  let errorString = '';

  if (!errors) return null;

  for (const field in errors.json) {
    errors.json[field].forEach((message: any) => {
      errorString += `${field}: ${message} `;
    });
  }

  return errorString.trim();
};

export const removeNullUndefined = (obj: any) => {
  const cleanedObj: any = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    // If the value is neither null nor undefined, add it to the cleaned object
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Recursively clean arrays
        cleanedObj[key] = value.map(item =>
          typeof item === 'object' && !(item instanceof Date) ? removeNullUndefined(item) : item,
        );
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Recursively clean objects, but exclude Date objects
        cleanedObj[key] = removeNullUndefined(value);
      } else {
        cleanedObj[key] = value;
      }
    }
  });

  return cleanedObj;
};

export function rgbToHex(r: any, g: any, b: any) {
  const toHex = (value: any) => {
    const hex = value.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
