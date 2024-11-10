import { useEffect, useState } from 'react';

type AsyncFunction<T> = () => Promise<T>;

const useAsyncEffect = <T>(asyncFunction: AsyncFunction<T>, dependencies: any[]) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;

    const executeAsyncFunction = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction();

        if (isMounted) {
          setData(result);
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    executeAsyncFunction();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { loading, error, data };
};

export default useAsyncEffect;
