import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const SESSION_ID_KEY = 'guestSessionId';

export const useGuestSession = () => {
  const [guestSessionId, setGuestSessionId] = useState(
    cookies.get(SESSION_ID_KEY)
  );
  useEffect(() => {
    const getGuestSessionId = async () => {
      const result = await fetch('/api/auth/session');
      const session = await result.json();
      cookies.set(SESSION_ID_KEY, session.guestSessionId, {
        expires: new Date(session.expires),
      });
      setGuestSessionId(session.guestSessionId);
    };

    if (!cookies.get('guestSessionId')) {
      void getGuestSessionId();
    }
  }, []);

  return { guestSessionId };
};
