import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

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
      {showFooter && (
        <>
          <footer className="bg-gray-900 text-gray-400 pt-6 sm:pt-8 md:pt-12 pb-24 md:pb-12">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Engala Trust</h3>
                <p className="text-sm">Empowering change through transparent and secure giving.</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li>How it Works</li>
                  <li>Pricing</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>Privacy Policy</li>
                  <li>Terms of Use</li>
                  <li>80G Info</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Contact</h4>
                <p className="text-sm">support@engalatrust.org</p>
              </div>
            </div>
          </footer>
          <BottomNav />
        </>
      )}
    </div>
  );
}) as React.FC<LayoutProps>;

Layout.displayName = 'Layout';

