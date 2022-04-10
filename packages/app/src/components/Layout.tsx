import { ReactNode } from 'react';
import { Header } from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="min-h-[80vh] px-2 lg:px-0">{children}</div>
      <footer className="min-h-[5rem] bg-black text-white flex justify-center items-center text-center">
        Footer
      </footer>
    </>
  );
};

export default Layout;
