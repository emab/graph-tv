import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Search } from '@/components/Search';
import { useQuery } from 'react-query';
import GraphDisplay, { Data } from '@/components/GraphDisplay';
import cx from 'classnames';
import { FaGithub, FaSadCry } from 'react-icons/fa';
import Head from 'next/head';
import { GithubLogo } from '@/components/GithubLogo';
import { SearchCredits } from '@/components/SearchCredits';
import { Welcome } from '@/components/Welcome';
import { Loading } from '@/components/Loading';
import { NoData } from '@/NoData';
import { SelectionInfo } from '@/components/SelectionInfo';
import { useRouter } from 'next/router';

const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== 'number') return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json();
};

export default function Home() {
  const { query, push } = useRouter();
  const [selectedShowId, setSelectedShowId] = useState<number>();

  useEffect(() => {
    if (query?.showId) {
      if (!isNaN(Number(query.showId))) {
        setSelectedShowId(Number(query.showId));
      }
    }
  }, [query]);

  useEffect(() => {
    if (selectedShowId && selectedShowId !== Number(query?.showId)) {
      void push(`/?showId=${selectedShowId}`);
    }
  }, [push, query, selectedShowId]);

  useEffect(() => {
    d3.select('body').append('div').attr('class', 'tooltip');

    return () => {
      Array.from(document.getElementsByClassName('tooltip')).forEach((el) =>
        el.remove()
      );
    };
  }, []);

  const { data, isLoading } = useQuery<Data>(
    ['getSeasonData', selectedShowId],
    () => getSeasonData(selectedShowId),
    { enabled: !!selectedShowId }
  );

  const episodeCount =
    data?.seasonEpisodeRatings.reduce((acc, next) => acc + next.length, 0) ?? 0;

  return (
    <>
      <Head>
        <title>Graph TV</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="View a ratings graph of your favourite TV shows"
        />
      </Head>
      <div className="bg-gray-700 min-h-full">
        <GithubLogo />
        <div className="bg-gray-800 py-5 flex flex-col items-center">
          <h1 className="text-5xl text-white font-bold pb-5">Graph TV</h1>
          <Search setSelectedShowId={setSelectedShowId} />
        </div>
        {data && selectedShowId ? (
          data.seasonEpisodeRatings.length ? (
            <>
              <SelectionInfo
                selectedName={data.name}
                episodeCount={episodeCount}
                seasonCount={data.seasonAverageRatings.length}
                overallRating={data.averageRating}
              />
              <GraphDisplay data={data} />
            </>
          ) : (
            <NoData />
          )
        ) : isLoading ? (
          <Loading />
        ) : (
          <Welcome />
        )}
      </div>
      ;
    </>
  );
}
