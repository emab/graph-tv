import { FaSadCry } from 'react-icons/fa';

export const NoData = () => (
  <div className="p-10 text-center">
    <p className="text-3xl text-white">Oh no!</p>
    <div className="flex justify-center text-6xl my-3 text-yellow-400">
      <FaSadCry />
    </div>
    <p className="text-xl text-white">
      There wasn&apos;t enough data to show graphs for that show. Try another
      one!
    </p>
  </div>
);
