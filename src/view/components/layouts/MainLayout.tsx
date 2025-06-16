import { Outlet } from 'react-router-dom';
import Header from '../Header';

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Header />

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
