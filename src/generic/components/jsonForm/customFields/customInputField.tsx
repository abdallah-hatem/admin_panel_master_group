import type { ObjectFieldTemplateProps } from '@rjsf/utils';

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { title, description, properties, uiSchema } = props;

  // Group fields by their row value in uiSchema
  const rows: Record<string, JSX.Element[]> = {};

  properties.forEach(element => {
    const row = uiSchema?.[element.name]?.row || 'default'; // Default for fields with no row

    if (!rows[row]) {
      rows[row] = [];
    }

    rows[row].push(element.content);
  });

  return (
    <div className="object-field-template">
      {title && <h3 className="title">{title}</h3>}
      {description && <p className="description">{description}</p>}

      {/* Render fields grouped by row */}
      {Object.keys(rows).map((rowKey, index) => {
        const fieldsInRow = rows[rowKey];

        let gridClasses = 'grid grid-cols-1'; // Default

        if (rowKey === 'default') {
          gridClasses = 'grid grid-cols-1';
        } else if (fieldsInRow.length === 2) {
          gridClasses = 'grid grid-cols-2';
        } else if (fieldsInRow.length === 3) {
          gridClasses = 'grid grid-cols-3';
        } else if (fieldsInRow.length > 3) {
          gridClasses = 'grid grid-cols-4';
        }

        return (
          <div key={index} className={`${gridClasses} gap-4 mb-4`}>
            {fieldsInRow.map((content, idx) => (
              <div key={idx}>{content}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
