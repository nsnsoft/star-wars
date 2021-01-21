import { useEffect, useState } from "react";

const useApi = (url) => {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let didCancel = false;
    const read = async () => {
      setPending(true);
      const rawResult = await fetch(url);
      const jsonResult = await rawResult.json();
      setData(jsonResult);
      setPending(false);
    };
    read();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [pending, data];
};
