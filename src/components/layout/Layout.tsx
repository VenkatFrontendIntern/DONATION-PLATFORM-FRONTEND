import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = React.memo(({
  children,
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}) as React.FC<LayoutProps>;

Layout.displayName = 'Layout';

