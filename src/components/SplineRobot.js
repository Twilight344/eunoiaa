import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';

const SplineRobot = ({ className = "w-full h-full" }) => {
  const splineRef = useRef(null);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      <Spline
        ref={splineRef}
        scene="https://prod.spline.design/6zMcXeSz9XH0-a76/scene.splinecode"
        className={className}
      />
    </div>
  );
};

export default SplineRobot; 