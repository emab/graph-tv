type SeasonSelectorProps = {
  seasonCount: number;
};

export const SeasonSelector = ({ seasonCount }: SeasonSelectorProps) => {
  return (
    <div className="text-center mb-4">
      <h2>Jump to season</h2>
      <div className="flex justify-evenly h-10 items-center">
        {new Array(seasonCount).fill(0).map((_, i) => (
          <a
            key={i}
            className="hover:scale-150"
            href={`#season=${i + 1}`}
            onClick={() =>
              document
                .getElementById(`season-${i + 1}`)
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
};
