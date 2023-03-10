import { CgSpinner } from 'react-icons/cg';

export const Loading = () => (
  <div className="p-10 text-center">
    <h3 className="text-2xl">Hang on! Grabbing data from TMDB...</h3>
    <div className="flex justify-center mt-5 text-4xl">
      <CgSpinner className="animate-spin" />
    </div>
  </div>
);
