import React, { useEffect, useRef } from 'react';

/**
 * useOutsideAlerter custom hook that triggers a callback when a click is detected outside the referenced element.
 */
function useOutsideAlerter(ref: any, callback: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * OutsideAlerter component that wraps any child component and alerts by triggering a callback when a click occurs outside of it.
 */
function OutsideAlerter({ children, callback } : { children: any, callback: any }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, callback);

  return <div ref={wrapperRef}>{children}</div>;
}

export default OutsideAlerter;
