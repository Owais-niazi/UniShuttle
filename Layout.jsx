import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Pages that should not have any layout wrapper
  const fullScreenPages = ['Home', 'StudentDashboard', 'AdminDashboard'];
  
  if (fullScreenPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {children}
    </div>
  );
}