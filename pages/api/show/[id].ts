// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BASE_URL } from '@/api';
import * as process from 'process';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results = await fetch(BASE_URL + `/tv/${req.query.id}?api_key=${process.env.API_KEY}`)

  const json = await results.json()

   res.json(json.number_of_seasons);
}
