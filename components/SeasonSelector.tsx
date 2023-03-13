import { useState } from 'react';
import { Modal } from '@/components/Modal';

type SeasonSelectorProps = {
  seasonCount: number;
};

export const SeasonSelector = ({ seasonCount }: SeasonSelectorProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="text-center mb-4">
      <div className="hidden md:block">
        <h2>Jump to season</h2>
        <div className="flex justify-evenly h-10 items-center">
          {new Array(seasonCount).fill(0).map((_, i) => (
            <a
              key={i}
              className="hover:scale-150 w-full"
              href={`#season-${i + 1}`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      </div>
      <div className="md:hidden">
        <button
          className="select-none drop-shadow-lg bg-gray-900 py-2 px-4 rounded"
          onClick={() => setShowModal(true)}
        >
          Select season
        </button>
        {showModal && (
          <Modal handleClose={() => setShowModal(false)}>
            <h2 className="text-2xl font-medium mb-2 text-center">
              Select season
            </h2>
            <div className="flex flex-col text-center">
              {new Array(seasonCount).fill(0).map((_, i) => (
                <a
                  key={`season-${i}`}
                  className="select-none p-3 my-1 bg-slate-600"
                  href={`#season-${i + 1}`}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Season {i + 1}
                </a>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
