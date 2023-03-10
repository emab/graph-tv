import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';

export const FloatingLinks = () => (
  <div className="fixed grid grid-cols-1 sm:grid-cols-2 gap-2 bottom-0 right-0 m-3 text-4xl">
    <a
      href="https://github.com/emab/graph-tv"
      target="_blank"
      rel="noreferrer"
      title="Check out the source code on GitHub!"
      className="bg-neutral-300 rounded-full bg-opacity-0 hover:bg-opacity-10 transition-all"
    >
      <FaGithub />
    </a>
    <a
      href="https://blog.devbrown.com/projects/"
      target="_blank"
      rel="noreferrer"
      title="My other projects"
      className="bg-neutral-300 rounded flex items-center justify-center bg-opacity-0 hover:bg-opacity-10 transition-all"
    >
      <Image
        src="/android-chrome-192x192.png"
        alt="My logo"
        width={30}
        height={30}
      />
    </a>
  </div>
);
