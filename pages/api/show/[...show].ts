// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/api';
import * as process from 'process';
import { bufferCount, firstValueFrom, from, mergeMap } from 'rxjs';

type EpisodeData = {
  name: string;
  episode_number: number;
  vote_average: number;
};

type SeasonData = {
  season_number: number;
  episodes: EpisodeData[];
}[];

const getSeason = async (url: string) => {
  const res = await fetch(url);

  return await res.json();
};

const getSeasonAverage = (episodes: EpisodeData[]) =>
  (
    episodes.reduce((acc, next) => acc + next.vote_average, 0) / episodes.length
  ).toFixed(2);

const handleGetShow = async (
  req: NextApiRequest,
  res: NextApiResponse,
  showId: string
) => {
  const results = await fetch(
    BASE_URL + `/tv/${showId}?api_key=${process.env.API_KEY}`
  );
  const json = await results.json();

  const seasons = json.seasons as { season_number: number }[];

  const source = from(seasons).pipe(
    mergeMap((season) =>
      getSeason(
        `${BASE_URL}/tv/${showId}/season/${season.season_number}?api_key=${process.env.API_KEY}`
      )
    ),
    bufferCount(json.seasons.length)
  );

  const result = (await firstValueFrom(source)) as SeasonData;

  const sortedResult = result
    .sort((s1, s2) => s1.season_number - s2.season_number)
    .slice(1);

  const seasonAverageRatings = sortedResult.map((season) => ({
    season: season.season_number,
    rating: getSeasonAverage(season.episodes),
  }));

  const getOverallEpisode = (
    allSeasons: SeasonData,
    seasonIndex: number,
    currentEpisodeNumber: number
  ) => {
    if (seasonIndex === 0) {
      return currentEpisodeNumber;
    }
    let episodeNumber = currentEpisodeNumber;
    for (let i = seasonIndex - 1; i >= 0; i--) {
      const prevSeason = allSeasons[i];
      episodeNumber += prevSeason.episodes.length;
    }
    return episodeNumber;
  };

  const seasonEpisodeRatings = sortedResult.map((season, seasonIndex) =>
    season.episodes.map((episode) => ({
      overallEpisode: getOverallEpisode(
        sortedResult,
        seasonIndex,
        episode.episode_number
      ),
      episode: episode.episode_number,
      rating: episode.vote_average,
      name: episode.name,
      season: season.season_number,
    }))
  );

  res.json({
    name: json.name,
    averageRating: json.vote_average,
    seasonAverageRatings,
    seasonEpisodeRatings,
  });
};

const rateShow = async (
  guestSessionId: string,
  showId: string,
  season: string,
  episode: string,
  rating: string
) =>
  fetch(
    BASE_URL +
      `/tv/${showId}/season/${season}/episode/${episode}/rating?api_key=${process.env.API_KEY}&guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: Number(rating) }),
    }
  );

const handleRateShow = async (
  req: NextApiRequest,
  res: NextApiResponse,
  showId: string
) => {
  const { guestSessionId, season, episode, rating } = req.body;

  try {
    await rateShow(guestSessionId, showId, season, episode, rating);
    res.status(200);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [showId, command] = req.query.show as string[];

  if (!command) {
    return handleGetShow(req, res, showId);
  }

  switch (command) {
    case 'rate':
      return handleRateShow(req, res, showId);
  }
}
