import axios from "axios";
import { useEffect, useState } from "react";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          cancelToken: source.token,
        });
        if (isMounted) {
          setData(response.data);
          setFetchError(null);
        }
      } catch (err) {
        setIsLoading(false);
        setFetchError(err.message);
        setData([]);
      } finally {
        isMounted = false;
        setIsLoading(false);
      }
    };

    fetchData(dataUrl);

    return () => {
      isMounted = false;
    };
  }, [dataUrl]);
  return { data, isLoading, fetchError };
};

export default useAxiosFetch;
