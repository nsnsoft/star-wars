import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutHandle = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutHandle);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
