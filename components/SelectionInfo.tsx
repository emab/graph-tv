type SelectionInfoProps = {
  selectedName: string;
  episodeCount: number;
  seasonCount: number;
  overallRating: number;
};

export const SelectionInfo = ({
  episodeCount,
  seasonCount,
  overallRating,
  selectedName,
}: SelectionInfoProps) => (
  <div className="bg-gray-900 p-10 text-xl text-center">
    <h2 className="font-bold text-4xl mb-2">{selectedName}</h2>
    <p>
      It has <span className="font-bold">{episodeCount} episodes</span> over{' '}
      <span className="font-bold">{seasonCount}</span> seasons with an overall
      rating of <span className="font-bold">{overallRating.toFixed(2)}</span>!
    </p>
  </div>
);
