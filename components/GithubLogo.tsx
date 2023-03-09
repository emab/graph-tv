import { FaGithub } from 'react-icons/fa';

export const GithubLogo = () => (
  <div className="fixed bottom-0 right-0 m-3 text-4xl rounded">
    <a
      href="https://github.com/emab/graph-tv"
      target="_blank"
      rel="noreferrer"
      title="Check out the source code on GitHub!"
    >
      <FaGithub />
    </a>
  </div>
);
