import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useSearchParams = () => {
  const { push, asPath } = useRouter();

  const setParam = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(asPath.slice(1));

      params.set(key, String(value));

      console.log(params.toString());

      void push(`?${params.toString()}`);
    },
    [asPath, push]
  );

  return { setParam };
};
