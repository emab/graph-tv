import { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/api';

const getGuestSession = async () => {
  const response = await fetch(
    BASE_URL +
      `/authentication/guest_session/new?api_key=${process.env.API_KEY}`
  );
  return await response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getGuestSession();
    res.json({
      guestSessionId: session.guest_session_id,
      expires: session.expires_at,
    });
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
