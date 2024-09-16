import { useEffect, useState } from "react";

const useDebounce = (value, time = 500) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value);
    }, time ?? 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [value, time]);
  return debounceValue;
};

export default useDebounce;
