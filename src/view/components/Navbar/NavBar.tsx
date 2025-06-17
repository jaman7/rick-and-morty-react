import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

interface MenuItem {
  name: string;
  to: string;
}

interface Props {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

const Navbar: React.FC<Props> = ({ isMobileMenuOpen = false, onClose }) => {
  const menuData: MenuItem[] = [
    {
      name: 'Characters',
      to: '/',
    },
    {
      name: 'Episodes',
      to: '/episodes',
    },
    {
      name: 'Location',
      to: '/location',
    },
  ];

  return (
    <nav
      id="main-navigation"
      className={classNames('navbar', { 'navbar--mobile': isMobileMenuOpen, 'navbar--visible': isMobileMenuOpen })}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className={classNames('menu')}>
        {menuData?.map((item, i) => (
          <li key={`menu-item-${i}`} onClick={onClose}>
            <NavLink
              className={({ isActive, isPending }) =>
                classNames('item', {
                  pending: isPending,
                  active: isActive,
                })
              }
              to={item.to as string}
            >
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
