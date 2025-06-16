import { NavLink } from 'react-router-dom';
import Navbar from './NavBar';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from '@/shared/components/button/Button';
import classNames from 'classnames';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className="header">
      <h2 className="header-title">
        <NavLink to={'/'}>Rick and Morty Characters</NavLink>
      </h2>
      <Button
        className={classNames('burger-icon', { open: isMobileMenuOpen })}
        handleClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </Button>
      <Navbar isMobileMenuOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
