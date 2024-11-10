import { Tag as AntdTag } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export function parseRichText(value: any) {
  if (!value || !Array.isArray(value)) {
    console.error('parseRichText: value is not an array');
    return value;
  }
  var ret = value.map((item, index) => {
    switch (item.type) {
      case 'text':
        return <span key={index}>{item.value}</span>;
      case 'link':
        // const linkTo = this.parseBackEndRoute(
        //     item.ref,
        //     item.id,
        //     item
        // )
        const linkTo = item.ref;
        return (
          <Link
            key={index}
            onClick={e => {
              e.stopPropagation();
              window.location.href = linkTo;
            }}
            to={linkTo}
          >
            <AntdTag>{item.label}</AntdTag>
          </Link>
        );
      case 'tag':
        return (
          <AntdTag key={index} color={item.color}>
            {item.label}
          </AntdTag>
        );
      default:
        console.error('parseRichText: unknown type');
        return null;
    }
  });
  return ret;
}
