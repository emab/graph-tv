import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Search } from '@/components/Search';
import { useQuery } from 'react-query';
import GraphDisplay, { Data } from '@/components/GraphDisplay';
import { FloatingLinks } from '@/components/FloatingLinks';
import { Welcome } from '@/components/Welcome';
import { Loading } from '@/components/Loading';
import { NoData } from '@/NoData';
import { SelectionInfo } from '@/components/SelectionInfo';
import { useRouter } from 'next/router';
import { FaChevronDown } from 'react-icons/fa';
import cx from 'classnames';
import { useSearchParams } from '@/hooks/useSearchParams';

const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== 'number') return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json();
};

export default function Home() {
  const { query, asPath } = useRouter();
  const [selectedShowId, setSelectedShowId] = useState<number>();
  const [showSearch, setShowSearch] = useState(true);
  const { setParam } = useSearchParams();

  useEffect(() => {
    if (query?.showId) {
      if (!isNaN(Number(query.showId))) {
        setSelectedShowId(Number(query.showId));
      }
    }
  }, [query, asPath]);

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
    {
      enabled: !!selectedShowId,
      onSuccess: () => {
        selectedShowId && setParam('showId', selectedShowId);
        setShowSearch(false);
      },
    }
  );

  useEffect(() => {
    const season = asPath.split('#')[1];

    if (season && !!data) {
      document.getElementById(season)?.scrollIntoView();
    }
  }, [asPath, data]);

  const episodeCount =
    data?.seasonEpisodeRatings.reduce((acc, next) => acc + next.length, 0) ?? 0;

  return (
    <>
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
