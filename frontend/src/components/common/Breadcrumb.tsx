import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    upload: 'Analyze MRI Scan',
    prediction: 'Prediction Result',
    history: 'Prediction History',
    report: 'Medical Report',
    settings: 'Settings',
    about: 'About VGG16',
    contact: 'Contact Us',
  };

  return (
    <nav className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
      <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || name;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-brand-600 dark:hover:text-brand-400 capitalize">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
