import { CgSpinner } from 'react-icons/cg';
import cx from 'classnames';

interface Spinner {
  className?: string;
}
export const Spinner = ({ className }: Spinner) => (
  <div className={cx('animate-spin', className)}>
    <CgSpinner />
  </div>
);
