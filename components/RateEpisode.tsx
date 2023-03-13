import { useCallback, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { interpolateRating } from '@/utils/interpolateRating';
import { normalizer } from '@/utils/dataTools';
import { useGuestSession } from '@/hooks/useGuestSession';
import { useMutation } from 'react-query';
import { CgSpinner } from 'react-icons/cg';
import cx from 'classnames';

type RateEpisode = {
  showId: number;
  season: number;
  episode: number;
  onSubmit?: VoidFunction;
};

const handleSubmit = async (
  guestSessionId: string,
  showId: number,
  season: number,
  episode: number,
  rating: string
) => {
  const response = await fetch(`/api/show/${showId}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guestSessionId, season, episode, rating }),
  });

  return (await response.json()) as { ok: boolean };
};

export const RateEpisode = ({
  showId,
  season,
  episode,
  onSubmit,
}: RateEpisode) => {
  const [rating, setRating] = useState('5');
  const { guestSessionId } = useGuestSession();

  const { data, isLoading, mutate } = useMutation(
    () => handleSubmit(guestSessionId, showId, season, episode, rating),
    { onSuccess: onSubmit }
  );

  const handleChange = useCallback((value: string | number) => {
    value = String(value);
    if (
      value === '' ||
      value === '10' ||
      value.match(/^\d$/) ||
      value.match(/^\d\.\d?$/)
    ) {
      setRating(value);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <button
          className={cx(
            'p-3 mr-4 bg-rose-900 hover:bg-rose-800 rounded-full',
            data && 'bg-slate-600 cursor-not-allowed'
          )}
          onClick={() => handleChange(Number(rating) - 1)}
          disabled={!!data?.ok}
        >
          <FaMinus />
        </button>
        <input
          id="rate-input"
          className="rounded-xl py-2 w-12 mt-0.5 text-center bg-slate-900"
          inputMode="decimal"
          value={rating}
          onChange={({ currentTarget: { value } }) => handleChange(value)}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            border: `3px solid ${interpolateRating(
              normalizer(0, 10)(Number(rating))
            )}`,
          }}
          disabled={!!data?.ok}
        />
        <button
          className={cx(
            'p-3 ml-4 bg-green-800 hover:bg-green-700 rounded-full',
            data && 'bg-slate-600 cursor-not-allowed'
          )}
          onClick={() => handleChange(Number(rating) + 1)}
          disabled={!!data?.ok}
        >
          <FaPlus />
        </button>
      </div>
      <button
        className={cx(
          'mt-2 p-2 rounded w-full',
          data
            ? 'bg-neutral-700 cursor-not-allowed'
            : 'bg-slate-600 hover:bg-slate-500'
        )}
        onClick={() => !isLoading && !data && mutate()}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex align-middle justify-center gap-4">
            Submitting <CgSpinner className="text-2xl animate-spin" />
          </span>
        ) : !!data ? (
          'Rating submitted!'
        ) : (
          'Submit'
        )}
      </button>
    </div>
  );
};
