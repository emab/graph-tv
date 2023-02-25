import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Search } from '@/components/Search';
import { useQuery } from 'react-query';
import GraphDisplay from '@/components/GraphDisplay';
import cx from 'classnames';

const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== 'number') return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json();
};

export default function Home() {
  const [selectedId, setSelectedId] = useState<number>();

  useEffect(() => {
    d3.select('body').append('div').attr('class', 'tooltip');

    return () => {
      Array.from(document.getElementsByClassName('tooltip')).forEach((el) =>
        el.remove()
      );
    };
  }, []);

  const { data } = useQuery(['getSeasonData', selectedId], () =>
    getSeasonData(selectedId)
  );

  return (
    <div className={cx(selectedId ? 'bg-blue-900' : 'bg-neutral-50 h-full ')}>
      <div className="bg-blue-900 py-5 flex flex-col items-center">
        <h1 className="text-5xl text-white font-bold pb-5">Graph TV</h1>
        <Search setSelectedId={setSelectedId} />
      </div>
      {data ? (
        <GraphDisplay data={data} />
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
