import type { FieldProps } from '@rjsf/utils';

const CustomRowField = (props: FieldProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 bg-red-500">
      {/* Render each property in the row */}
      {Object.keys(props.properties).map((key, index) => (
        <div key={index} className="col-span-1 bg-red-500">
          {props.properties[key].content}
        </div>
      ))}
    </div>
  );
};

export default CustomRowField;
