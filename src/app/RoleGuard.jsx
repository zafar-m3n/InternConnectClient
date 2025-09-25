import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getToken } from '../lib/auth';

const HOME_BY_ROLE = {
  student: '/student/dashboard',
  industry_liaison: '/industry/dashboard', 
  liaison: '/industry/dashboard',
  super_admin: '/admin/dashboard'
};

const RoleGuard = ({ children, roles }) => {
  const { user } = useAuth();
  const token = getToken();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const defaultHome = HOME_BY_ROLE[user.role] || '/login';
    return <Navigate to={defaultHome} replace />;
  }

  return children;
};

export default RoleGuard;