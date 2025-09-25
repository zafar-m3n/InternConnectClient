import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './app/AuthProvider';
import RoleGuard from './app/RoleGuard';

// Auth pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Forgot from './features/auth/pages/Forgot';
import Reset from './features/auth/pages/Reset';

// Student pages
import StudentDashboard from './features/student/dashboard/StudentDashboard';
import StudentProfile from './features/student/profile/StudentProfile';
import StudentInternshipsList from './features/student/internships/StudentInternshipsList';
import StudentInternshipDetail from './features/student/internships/StudentInternshipDetail';
import StudentApplications from './features/student/applications/StudentApplications';

// Industry pages
import LiaisonDashboard from './features/industry/dashboard/LiaisonDashboard';
import LiaisonInternshipsList from './features/industry/internships/LiaisonInternshipsList';
import LiaisonInternshipForm from './features/industry/internships/LiaisonInternshipForm';
import LiaisonInternshipDetail from './features/industry/internships/LiaisonInternshipDetail';
import LiaisonApplicants from './features/industry/applicants/LiaisonApplicants';
import LiaisonCVQueue from './features/industry/cv/LiaisonCVQueue';

// Admin pages
import AdminDashboard from './features/admin/dashboard/AdminDashboard';
import TenantsList from './features/admin/tenants/TenantsList';
import SystemSettings from './features/admin/settings/SystemSettings';

// Shared pages
import NotificationsList from './features/notifications/NotificationsList';

const HOME_BY_ROLE = {
  student: '/student/dashboard',
  industry_liaison: '/industry/dashboard',
  super_admin: '/admin/dashboard'
};

const Router = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />} />
      <Route path="/forgot" element={!user ? <Forgot /> : <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />} />
      <Route path="/reset" element={!user ? <Reset /> : <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />} />

      {/* Student routes */}
      <Route path="/student/dashboard" element={
        <RoleGuard roles={['student']}>
          <StudentDashboard />
        </RoleGuard>
      } />
      <Route path="/student/profile" element={
        <RoleGuard roles={['student']}>
          <StudentProfile />
        </RoleGuard>
      } />
      <Route path="/student/internships" element={
        <RoleGuard roles={['student']}>
          <StudentInternshipsList />
        </RoleGuard>
      } />
      <Route path="/student/internships/:id" element={
        <RoleGuard roles={['student']}>
          <StudentInternshipDetail />
        </RoleGuard>
      } />
      <Route path="/student/applications" element={
        <RoleGuard roles={['student']}>
          <StudentApplications />
        </RoleGuard>
      } />

      {/* Industry routes */}
      <Route path="/industry/dashboard" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonDashboard />
        </RoleGuard>
      } />
      <Route path="/industry/internships" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonInternshipsList />
        </RoleGuard>
      } />
      <Route path="/industry/internships/new" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonInternshipForm />
        </RoleGuard>
      } />
      <Route path="/industry/internships/:id" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonInternshipDetail />
        </RoleGuard>
      } />
      <Route path="/industry/internships/:id/edit" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonInternshipForm />
        </RoleGuard>
      } />
      <Route path="/industry/applicants" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonApplicants />
        </RoleGuard>
      } />
      <Route path="/industry/cv-pending" element={
        <RoleGuard roles={['industry_liaison', 'liaison', 'super_admin']}>
          <LiaisonCVQueue />
        </RoleGuard>
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <RoleGuard roles={['super_admin']}>
          <AdminDashboard />
        </RoleGuard>
      } />
      <Route path="/admin/tenants" element={
        <RoleGuard roles={['super_admin']}>
          <TenantsList />
        </RoleGuard>
      } />
      <Route path="/admin/settings" element={
        <RoleGuard roles={['super_admin']}>
          <SystemSettings />
        </RoleGuard>
      } />

      {/* Shared authenticated routes */}
      <Route path="/notifications" element={
        <RoleGuard roles={['student', 'industry_liaison', 'liaison', 'super_admin']}>
          <NotificationsList />
        </RoleGuard>
      } />

      {/* Default redirects */}
      <Route path="/" element={
        user ? <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace /> : <Navigate to="/login" replace />
      } />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      } />

      {/* 404 page */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default Router;