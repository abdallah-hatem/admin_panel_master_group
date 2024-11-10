import { Button, Steps } from 'antd';
import { useState } from 'react';

import Itinerary from './itinerary';
import MainPackageDetails from './mainPackageDetails';

export default function CreatePackage() {
  const { Step } = Steps;

  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const steps = [
    {
      title: 'Main Details',
      content: <MainPackageDetails next={next} />,
    },
    {
      title: 'Itineraries',
      content: <Itinerary activityData={null} next={next} />,
    },
  ];

  return (
    <div className="!p-10">
      <Steps current={current} className="mb-10">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {/* {current < steps.length - 1 && (
        <Button type="primary" onClick={next}>
          Next
        </Button>
      )} */}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => alert('Process complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}
