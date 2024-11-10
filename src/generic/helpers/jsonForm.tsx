import { Tag } from 'antd';
import axios from 'axios';

import { ApiBaseUrl } from '../api/request';
import ToolTipColumn from '../components/jsonForm/columnsCustomComponents/toolTipColumn';

interface Props {
  schema: any;
  allowSort?: boolean;
}

export const transformSchemaToColumns = ({ schema, allowSort = false }: Props): any[] => {
  // const mapping: { [key: string]: number } = {
  //   address: 100,
  //   city: 100,
  //   country_code: 100,
  //   terminal_registration_code: 150,
  // };

  return Object.keys(schema).map(key => {
    const field = schema[key];
    const title = field.title ? field.title.replace(/_/g, ' ') : key;
    const width = Math.max(title.length * 11, 90); // Dynamically set width with minimum

    console.log(field);

    const type = () => {
      if (field?.type?.length > 0 && field?.type?.includes('number')) return 'number';

      if (field?.type?.length > 0 && field?.type?.includes('boolean')) return 'boolean';

      // if (field?.type?.length > 0 && field?.type?.includes('date')) return 'date';

      // if (field?.type?.length > 0 && field?.type?.includes('string')) return 'string';

      return field?.type;
    };

    const sorter = allowSort && type() === 'number' ? (a: any, b: any) => a[title] - b[title] : null;

    return {
      title,
      dataIndex: key,
      key: 'id', // Assuming 'id' as a common key; adapt if needed
      width,
      sorter,
      render: type() === 'boolean' ? (value: any) => `${value}` : undefined,
    };
  });
};

type QuerySchemaType = {
  $schema: string;
  definitions: {
    [key: string]: {
      type: string;
      properties: { [key: string]: any };
      additionalProperties: boolean;
    };
  };
  $ref: string;
};

export const removeKeysFromSchema = (schema: QuerySchemaType, keysToRemove: string[]): QuerySchemaType => {
  const updatedSchema = { ...schema };

  keysToRemove.forEach(key => {
    delete updatedSchema?.definitions[Object.keys(schema?.definitions)[0]]?.properties[key];
  });

  return updatedSchema;
};

export const extractEnum = (schemaObject: any, key: any) => {
  // Check if the key exists in the schema's properties
  if (schemaObject?.properties?.[key]?.enum) {
    return schemaObject.properties[key].enum;
  }

  // If the key doesn't exist or enum is not present, return an empty array or handle accordingly
  return [];
};

// interface JSONSchema {
//   type: string;
//   required?: string[];
//   properties: Record<string, any>;
// }

export function filterObjectBySchema(schema: any, data: Record<string, any>): Record<string, any> {
  console.log(schema);

  // if (!schema) return {};

  // Extract the properties from the schema
  const schemaProperties = schema?.definitions[Object.keys(schema?.definitions)[0]]?.properties;

  console.log(schemaProperties);

  // Create a new object to store the filtered fields
  const filteredObject: Record<string, any> = {};

  // Iterate through the data keys
  for (const key in data) {
    // Check if the key exists in the schema's properties
    if (key in schemaProperties) {
      filteredObject[key] = data[key];
    }
  }

  return filteredObject;
}

export const formatJsonFormColumns = (columns: any) => {
  console.log(columns);

  return columns.map((el: any) => {
    if (el.render) {
      if (el.render === 'Tooltip')
        return {
          ...el,
          render: (data: any) => {
            console.log(data);

            if (!data) return 'No data';

            return <ToolTipColumn value={data.value} tooltip={data.tooltip} />;
          },
        };

      if (el.render === 'Boolean')
        return {
          ...el,
          render: (data: any) => {
            console.log(data);

            return <Tag color={data ? 'green' : 'red'}>{data ? 'Yes' : 'No'}</Tag>;
          },
        };

      return el;
    }

    return el;
  });
};

interface JSONSchema {
  definitions: {
    [key: string]: {
      properties: {
        [key: string]: {
          type: string;
        };
      };
    };
  };
  $ref: string;
}

export function transformData<T extends Record<string, any>>(schema: JSONSchema, data: T): T {
  // Extract the reference key from the $ref property
  const refKey = schema.$ref.replace('#/definitions/', '');

  // Get the properties from the schema using the reference key
  const schemaProperties = schema.definitions[refKey].properties;

  // Iterate over the data object and transform values based on the schema type
  const transformedData = Object.entries(data).reduce((acc: any, [key, value]) => {
    const schemaProperty = schemaProperties[key];

    if (schemaProperty && schemaProperty.type === 'number') {
      // Convert the value to a number if the schema type is 'number'
      acc[key] = Number(value);
    } else {
      // Otherwise, keep the value as is
      acc[key] = value;
    }

    return acc;
  }, {} as T);

  return transformedData;
}

export function customValidate(formData: any, errors: any, uiSchema: any) {
  console.log(uiSchema);
  console.log(formData);

  if (!uiSchema || !formData) return {};

  // Iterate over the fields in the uiSchema
  Object.keys(uiSchema).forEach(fieldKey => {
    const field = uiSchema[fieldKey];

    // Check if 'ui:validate' is true for this field
    if (field['ui:validate'] === true) {
      const keysToCheck = [];

      // Add ui:textKey and ui:selectKey to keysToCheck if they exist
      if (field['ui:textKey']) {
        keysToCheck.push(field['ui:textKey']);
      }

      if (field['ui:selectKey']) {
        keysToCheck.push(field['ui:selectKey']);
      }

      // Check if all keys exist in the corresponding formData field
      const allKeysExist = keysToCheck.every(key => key in formData[fieldKey]);

      const hasNullOrEmpty = Object.keys(formData[fieldKey]).some(
        key => formData[fieldKey][key] === null || formData[fieldKey][key] === '',
      );

      if (!allKeysExist || hasNullOrEmpty) {
        errors[fieldKey].addError(`Error in ${fieldKey}: please fill all required fields.`);
      }
    }
  });

  return errors;
}

export function transformFormData(data: any, uiSchema: any) {
  let transformedData: any = {};

  for (const key in data) {
    if (uiSchema[key] && uiSchema[key]['ui:spread']) {
      transformedData = { ...transformedData, ...data[key] };
    } else {
      transformedData[key] = data[key];
    }
  }

  return transformedData;
}

export const getDataByRoute = async ({ apiRoute, onFetch }: { apiRoute: any; onFetch: (res: any) => void }) => {
  const params: any = {};

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('t')}`,
    },
  };

  const response = await axios.get(ApiBaseUrl + `/${apiRoute}?${new URLSearchParams(params)}`, config);

  console.log(response);

  onFetch(response?.data);
};

export const getTitleWithDescription = (title: any, description: string, descriptionStyleTwo?: string) => (
  <div className="flex flex-col">
    <span>{title}</span>

    <span className={`text-xs text-gray-500 mt-1 ${descriptionStyleTwo}`}>{description}</span>
  </div>
);
