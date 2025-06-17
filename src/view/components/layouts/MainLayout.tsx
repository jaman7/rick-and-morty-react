import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Header />

      <main className="main" role="main" aria-label="Main content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
