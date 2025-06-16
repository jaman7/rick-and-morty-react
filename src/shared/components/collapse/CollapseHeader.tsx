import { FaCaretDown } from 'react-icons/fa';
import classNames from 'classnames';

interface Props {
  id: string;
  isOpen: boolean;
  iconArrowLast?: boolean;
  label?: string;
  onClick: () => void;
}

const CollapseHeader = ({ id, isOpen, iconArrowLast = false, label, onClick }: Props) => {
  return (
    <div
      id={id}
      className={classNames('collapsed__header px-1', {
        'collapsed__header--reversed': iconArrowLast,
        'mb-2': isOpen,
      })}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={`${id}-content`}
    >
      <FaCaretDown className={classNames('icon', { open: isOpen })} />
      <span>{label}</span>
    </div>
  );
};

export default CollapseHeader;
