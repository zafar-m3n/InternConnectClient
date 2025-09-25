import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';
import { classNames } from '../lib/ui';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    if (user?.role === 'student') {
      return [
        { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/student/profile', label: 'Profile', icon: '👤' },
        { to: '/student/internships', label: 'Internships', icon: '💼' },
        { to: '/student/applications', label: 'Applications', icon: '📄' },
        { to: '/notifications', label: 'Notifications', icon: '🔔' }
      ];
    }

    if (user?.role === 'industry_liaison') {
      return [
        { to: '/industry/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/industry/internships', label: 'Internships', icon: '💼' },
        { to: '/industry/applicants', label: 'Applicants', icon: '👥' },
        { to: '/industry/cv-pending', label: 'CV Review', icon: '📋' },
        { to: '/notifications', label: 'Notifications', icon: '🔔' }
      ];
    }

    if (user?.role === 'super_admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/admin/tenants', label: 'Tenants', icon: '🏢' },
        { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
        { to: '/notifications', label: 'Notifications', icon: '🔔' }
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  if (!user) return null;

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
      </div>
      
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={classNames(
                'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;