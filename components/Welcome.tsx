import { SearchCredits } from '@/components/SearchCredits';

export const Welcome = () => (
  <div className="p-10 text-center">
    <p className="text-2xl font-bold">Welcome!</p>
    <p className="mt-4">
      To get started, enter the name of a show in the search bar above.
    </p>
    <p className="mt-3">
      <a
        href="https://blog.devbrown.com/"
        className="underline text-blue-500 hover:text-blue-600"
        target="_blank"
        rel="noreferrer"
      >
        Check out my site
      </a>{' '}
      for other projects I&apos;ve been working on, or use the link in the
      bottom left to go to my GitHub page.
    </p>
    <SearchCredits />
  </div>
);
