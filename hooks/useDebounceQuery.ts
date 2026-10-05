import { useEffect, useState } from "react";

export const useDebounceQuery = <T>(value: T, delay = 500) => {
  const [debounceQuery, setDebounceQuery] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return {
    debounceQuery,
  };
};
