import { Button, Input } from 'antd';
import React from 'react';

import IncDecComp from './incDecComp';

interface PriceItemProps {
  data: {
    client_type: string;
    min: number;
    max: number;
    price: number;
  };
  index: number;
  incrementMin: (index: number) => void;
  decrementMin: (index: number) => void;
  incrementMax: (index: number) => void;
  decrementMax: (index: number) => void;
  handlePriceChange: (index: number, value: number) => void;
  handleInputChange: (index: number, val: number, type: 'min' | 'max') => void;
}

const PriceItem: React.FC<PriceItemProps> = ({
  data,
  index,
  incrementMin,
  decrementMin,
  incrementMax,
  decrementMax,
  handlePriceChange,
  handleInputChange,
}) => {
  const { client_type, min, max, price } = data;

  console.log(data);

  return (
    <div className="flex flex-row items-center space-x-10 mb-10">
      <div className="text-center flex flex-col">
        <label htmlFor={`min_${index}`} className="mb-1">
          Min
        </label>
        <IncDecComp
          placeholder="Min"
          increment={() => {
            incrementMin(index);
          }}
          decrement={() => decrementMin(index)}
          formName={`min_${index}`}
          handleInputChange={handleInputChange}
          formType="input"
          value={min}
          index={index}
          type="min"
        />
      </div>

      <div className="text-center flex flex-col w-[60px] mt-6">
        <span>{client_type}</span>
      </div>

      <div className="text-center flex flex-col">
        <label htmlFor={`max_${index}`} className="mb-1">
          Max
        </label>

        <IncDecComp
          placeholder="Max"
          increment={() => incrementMax(index)}
          decrement={() => decrementMax(index)}
          handleInputChange={handleInputChange}
          formName={`max_${index}`}
          formType="input"
          value={max}
          index={index}
          type="max"
        />
      </div>

      <div className="flex flex items-center space-x-4 mt-6">
        <label htmlFor={`price_${index}`} className="mb-1">
          Price
        </label>
        <Input
          id={`price_${index}`}
          type="number"
          value={price}
          placeholder="Price"
          onChange={e => handlePriceChange(index, parseFloat(e.target.value))}
          className="w-20 text-center"
        />
      </div>
    </div>
  );
};

export default React.memo(PriceItem);
