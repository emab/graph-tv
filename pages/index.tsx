import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Search } from '@/components/Search';
import { useQuery } from 'react-query';
import GraphDisplay, { Data } from '@/components/GraphDisplay';
import Head from 'next/head';
import { FloatingLinks } from '@/components/FloatingLinks';
import { Welcome } from '@/components/Welcome';
import { Loading } from '@/components/Loading';
import { NoData } from '@/NoData';
import { SelectionInfo } from '@/components/SelectionInfo';
import { useRouter } from 'next/router';
import { FaChevronDown } from 'react-icons/fa';
import cx from 'classnames';

const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== 'number') return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json();
};

export default function Home() {
  const { query, push } = useRouter();
  const [selectedShowId, setSelectedShowId] = useState<number>();
  const [showSearch, setShowSearch] = useState(true);

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
    { enabled: !!selectedShowId, onSuccess: () => setShowSearch(false) }
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
        <FloatingLinks />
        <div
          className={cx(
            'relative bg-gray-800 py-5 flex flex-col cursor-pointer items-center select-none',
            !showSearch && 'hover:opacity-100 hover:text-xl'
          )}
        >
          <h1
            className={cx(
              'text-5xl font-bold opacity-100 hover:text-blue-100',
              showSearch ? 'pb-5' : 'pb-2'
            )}
            onClick={() => setShowSearch(!showSearch)}
          >
            Graph TV
          </h1>

          <FaChevronDown
            className={cx(
              'opacity-60 absolute hover:opacity-100 text-blue-100 hover:text-xl cursor-pointer transition-all',
              !showSearch ? 'bottom-1' : 'bottom-0 rotate-180'
            )}
            onClick={() => setShowSearch(!showSearch)}
          />

          {showSearch && <Search setSelectedShowId={setSelectedShowId} />}
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
    </>
  );
}
