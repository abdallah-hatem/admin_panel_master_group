import type { AgesDto } from '@/interface/ages';

import { Form } from 'antd';
import { useEffect, useState } from 'react';

import MyForm from '@/generic/components/core/form';
import MyformItem from '@/generic/components/core/form-item';

import PriceItem from './priceItem';

interface PriceItemData {
  client_type: string;
  min: number;
  max: number;
  price: number;
  clients_age_ranges_id: number | string | null;
}

interface Props {
  setPrices: (data: any) => void;
  pricesData?: any[];
  switchStyleTw?: string;
}

export default function SchedulePricesComp({ setPrices, pricesData, switchStyleTw }: Props) {
  const [form] = Form.useForm();
  const [ages, setAges] = useState<AgesDto[]>([]);
  const [persons, setPersons] = useState<boolean>(false);
  const [personPriceItem, setPersonPriceItem] = useState<PriceItemData>({
    client_type: 'Persons',
    clients_age_ranges_id: null,
    min: 0,
    max: 0,
    price: 0,
  });
  const [priceItems, setPriceItems] = useState<PriceItemData[]>([]);
  const [initItems, setInitItems] = useState<any[]>([]);

  console.log(priceItems);

  console.log(personPriceItem);

  console.log(pricesData);

  // getting the client types
  useEffect(() => {
    // GET_AGES().then((res: any) => {
    //   setAges(res);
    //   const initialPriceItems = res.map((el: AgesDto) => ({
    //     client_type: el.client_type,
    //     clients_age_ranges_id: el.id,
    //     min: 0,
    //     max: 0,
    //     price: 0,
    //   }));
    //   setInitItems(initialPriceItems);
    //   setPriceItems(initialPriceItems);
    // });
  }, []);

  useEffect(() => {
    getPersonData();
  }, [pricesData, persons]);

  // useEffect(() => {
  //   if (pricesData && pricesData.length > 0) {
  //     if (pricesData[0].clients_age_ranges !== null) {
  //       setPersons(true);
  //       form.setFieldsValue({
  //         persons: true,
  //       });
  //     } else {
  //       setPersons(false);
  //       form.setFieldsValue({
  //         persons: false,
  //       });
  //     }
  //   }
  // }, [pricesData]);

  useEffect(() => {
    let val = priceItems.map(el => {
      return {
        minimum_participants: el.min,
        maximum_participants: el.max,
        price: el.price,
        clients_age_ranges_id: el.clients_age_ranges_id,
      };
    });

    if (!persons) {
      val = [
        {
          minimum_participants: personPriceItem.min,
          maximum_participants: personPriceItem.max,
          price: personPriceItem.price,
          clients_age_ranges_id: personPriceItem.clients_age_ranges_id,
        },
      ];
    }

    setPrices(val);
  }, [priceItems, personPriceItem, persons]);

  function getPersonData() {
    if (pricesData && pricesData.length > 0) {
      if (pricesData[0].clients_age_ranges !== null) {
        setPersonPriceItem({
          client_type: 'Persons',
          clients_age_ranges_id: null,
          min: 0,
          max: 0,
          price: 0,
        });
      }

      if (pricesData[0].clients_age_ranges === null) {
        const { price, minimum_participants, maximum_participants } = pricesData[0];

        setPriceItems(initItems);

        return setPersonPriceItem({
          client_type: 'Persons',
          clients_age_ranges_id: null,
          min: minimum_participants,
          max: maximum_participants,
          price,
        });
      }

      const initialPriceItems = initItems.map(item1 => {
        const matchingItem2 =
          pricesData && pricesData.find(item2 => item2.clients_age_ranges.client_type === item1.client_type);

        if (matchingItem2) {
          console.log(matchingItem2);

          return {
            ...item1,
            min: matchingItem2.minimum_participants,
            max: matchingItem2.maximum_participants,
            price: matchingItem2.price,
          };
        }

        return item1;
      });

      console.log(initialPriceItems);

      setPriceItems(initialPriceItems);
    }
  }

  const incrementMin = (index: number | string) => {
    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    console.log(index);
    console.log(newPriceItems);

    // newPriceItems[index].min += 1;

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        return {
          ...el,
          min: el.min + 1,
        };
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(newPriceItems);
    setPriceItems(updatedPricesItems);

    // form.setFieldsValue({ [`min_${index}`]: newPriceItems[index].min });
  };

  const decrementMin = (index: number) => {
    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    console.log(index);
    console.log(newPriceItems);

    // newPriceItems[index].min += 1;

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        return {
          ...el,
          min: el.min - 1,
        };
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(newPriceItems);
    setPriceItems(updatedPricesItems);

    // form.setFieldsValue({ [`min_${index}`]: newPriceItems[index].min });
  };

  const incrementMax = (index: number) => {
    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    console.log(index);
    console.log(newPriceItems);

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        return {
          ...el,
          max: el.max + 1,
        };
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(newPriceItems);
    setPriceItems(updatedPricesItems);

    // form.setFieldsValue({ [`max_${index}`]: newPriceItems[index].max });
  };

  const decrementMax = (index: number) => {
    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    console.log(index);
    console.log(newPriceItems);

    // newPriceItems[index].min += 1;

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        return {
          ...el,
          max: el.max - 1,
        };
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(newPriceItems);
    setPriceItems(updatedPricesItems);
    // form.setFieldsValue({ [`max_${index}`]: newPriceItems[index].max });
  };

  const handleInputChange = (index: number | string, val: number, type: 'min' | 'max') => {
    if (index === 'persons') {
      return setPersonPriceItem({ ...personPriceItem, [type]: val });
    }

    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    // console.log(val);
    console.log(newPriceItems);

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        if (type === 'min') {
          return {
            ...el,
            min: val,
          };
        } else {
          return {
            ...el,
            max: val,
          };
        }
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(updatedPricesItems);
    setPriceItems(updatedPricesItems);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceItems = priceItems.map(el => {
      return {
        ...el,
        id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
      };
    });

    const updatedPricesItems = newPriceItems.map(el => {
      if (String(index) === el.id) {
        return {
          ...el,
          price: value,
        };
      } else {
        return {
          ...el,
          id: `${el.client_type}-${el.max}-${el.price}-${el.min}`,
        };
      }
    });

    console.log(newPriceItems);
    setPriceItems(updatedPricesItems);
    // form.setFieldsValue({ [`price_${index}`]: value });
  };

  const handlePersonMinChange = (value: number) => {
    setPersonPriceItem({ ...personPriceItem, min: value });
    form.setFieldsValue({ min_persons: value });
  };

  const handlePersonMaxChange = (value: number) => {
    setPersonPriceItem({ ...personPriceItem, max: value });
    form.setFieldsValue({ max_persons: value });
  };

  const handlePersonPriceChange = (value: number) => {
    setPersonPriceItem({ ...personPriceItem, price: value });
    form.setFieldsValue({ price_persons: value });
  };

  function onFinish(values: any) {
    console.log('Form values:', values);
  }

  return (
    <div>
      <p>Schedule prices:</p>
      <MyForm<any>
        onFinish={onFinish}
        form={form}
        className="mb-10"
        layout="horizontal"
        labelCol={{ span: 3 }}
        labelAlign="left"
      >
        {/* switch */}
        <div className="flex items-center space-x-3 mb-5">
          <span>Use specific client types?</span>
          <MyformItem
            // label="Use specific client types? "
            name="persons"
            type="switch"
            className={`mb-0 ${switchStyleTw}`}
            innerProps={{
              // style: { marginLeft: 20 },
              onChange: (e: boolean) => {
                setPersons(e);
              },
            }}
          />
        </div>

        {!persons ? (
          <PriceItem
            data={personPriceItem}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            index={'persons'}
            incrementMin={() => handlePersonMinChange(personPriceItem.min + 1)}
            decrementMin={() => handlePersonMinChange(Math.max(personPriceItem.min - 1, 0))}
            incrementMax={() => handlePersonMaxChange(personPriceItem.max + 1)}
            decrementMax={() => handlePersonMaxChange(Math.max(personPriceItem.max - 1, 0))}
            handlePriceChange={(index, value) => handlePersonPriceChange(value)}
            handleInputChange={(index: number, val: number, type: 'min' | 'max') => handleInputChange(index, val, type)}
          />
        ) : (
          <>
            {priceItems.map((el, index) => (
              <PriceItem
                key={index}
                data={el}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                index={`${el.client_type}-${el.max}-${el.price}-${el.min}`}
                incrementMin={incrementMin}
                decrementMin={decrementMin}
                incrementMax={incrementMax}
                decrementMax={decrementMax}
                handlePriceChange={handlePriceChange}
                handleInputChange={(index: number, val: number, type: 'min' | 'max') =>
                  handleInputChange(index, val, type)
                }
              />
            ))}
          </>
        )}
      </MyForm>
    </div>
  );
}
