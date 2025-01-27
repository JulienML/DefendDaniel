'use client';

import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;