'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ToastProvider } from '../ui/Toast';

interface AppLayoutProps {
  children: ReactNode;
}

// Shell container incorporating sidebar + responsive frame + notification engine
export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Viewport content area offset by sidebar width */}
        <div style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          minWidth: 0, // Prevents flex child blowout
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
export default AppLayout;
