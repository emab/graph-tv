import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Search } from '@/components/Search';
import { useQuery } from 'react-query';
import GraphDisplay, { Data } from '@/components/GraphDisplay';
import cx from 'classnames';
import { FaSadCry, FaGithub } from 'react-icons/fa';

const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== 'number') return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json();
};

export default function Home() {
  const [selected, setSelected] = useState<{
    name: string;
    id: number;
    rating: number;
  }>();

  useEffect(() => {
    d3.select('body').append('div').attr('class', 'tooltip');

    return () => {
      Array.from(document.getElementsByClassName('tooltip')).forEach((el) =>
        el.remove()
      );
    };
  }, []);

  const { data } = useQuery<Data>(
    ['getSeasonData', selected?.id],
    () => getSeasonData(selected?.id),
    { enabled: !!selected }
  );

  const episodeCount = data?.seasonEpisodeRatings.reduce(
    (acc, next) => acc + next.length,
    0
  );

  return (
    <div className={cx(data ? 'bg-blue-900' : 'bg-neutral-50 h-full ')}>
      <div className="fixed bottom-0 right-0 m-3 text-4xl">
        <a
          href="https://github.com/emab/graph-tv"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>
      </div>
      <div className="bg-blue-900 py-5 flex flex-col items-center">
        <h1 className="text-5xl text-white font-bold pb-5">Graph TV</h1>
        <Search setSelected={setSelected} />
      </div>
      {data ? (
        data.seasonEpisodeRatings.length ? (
          <>
            <div className="bg-blue-200 p-10 text-xl text-center">
              <p>
                You&apos;ve selected{' '}
                <span className="font-bold">{selected?.name}</span>.
              </p>
              <p>
                It has{' '}
                <span className="font-bold">{episodeCount} episodes</span> over{' '}
                <span className="font-bold">
                  {data.seasonAverageRatings.length}
                </span>{' '}
                seasons with an overall rating of{' '}
                <span className="font-bold">
                  {selected?.rating?.toFixed(2)}
                </span>
                !
              </p>
            </div>
            <GraphDisplay data={data} />
          </>
        ) : (
          <div className="p-10 text-center">
            <p className="text-3xl text-white">Oh no!</p>
            <div className="flex justify-center text-6xl my-3 text-yellow-400">
              <FaSadCry />
            </div>
            <p className="text-xl text-white">
              There wasn&apos;t enough data to show graphs for that show. Try
              another one!
            </p>
          </div>
        )
      ) : (
        <div className="p-10 text-center">
          <p className="text-xl">Hey and welcome to GraphTV!</p>
          <p className="mt-4">
            To get started, enter the name of a show in the search bar above.
          </p>
          <p>
            Search and ratings are{' '}
            <a
              className="underline text-blue-500 hover:text-blue-600"
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
            >
              powered by TMDB
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
