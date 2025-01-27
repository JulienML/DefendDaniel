// /$$$$$$  /$$$$$$ /$$    /$$ /$$$$$$$$       /$$      /$$ /$$$$$$$$        /$$$$$$           /$$$$$  /$$$$$$  /$$$$$$$ 
// /$$__  $$|_  $$_/| $$   | $$| $$_____/      | $$$    /$$$| $$_____/       /$$__  $$         |__  $$ /$$__  $$| $$__  $$
// | $$  \__/  | $$  | $$   | $$| $$            | $$$$  /$$$$| $$            | $$  \ $$            | $$| $$  \ $$| $$  \ $$
// | $$ /$$$$  | $$  |  $$ / $$/| $$$$$         | $$ $$/$$ $$| $$$$$         | $$$$$$$$            | $$| $$  | $$| $$$$$$$ 
// | $$|_  $$  | $$   \  $$ $$/ | $$__/         | $$  $$$| $$| $$__/         | $$__  $$       /$$  | $$| $$  | $$| $$__  $$
// | $$  \ $$  | $$    \  $$$/  | $$            | $$\  $ | $$| $$            | $$  | $$      | $$  | $$| $$  | $$| $$  \ $$
// |  $$$$$$/ /$$$$$$   \  $/   | $$$$$$$$      | $$ \/  | $$| $$$$$$$$      | $$  | $$      |  $$$$$$/|  $$$$$$/| $$$$$$$/
// \______/ |______/    \_/    |________/      |__/     |__/|________/      |__/  |__/       \______/  \______/ |_______/ 
//
// Hi, I'm Roland and i'm looking for a job.
// Resume in /public/resume.pdf
// roland.vrignon@roland.com
// https://www.linkedin.com/in/roland-vrignon/
//


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