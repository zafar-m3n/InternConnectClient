import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setUser as setStoredUser } from '../lib/auth';
import { authService } from '../services/auth';
import Loader from '../components/Loader';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getUser();

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getProfile();
          setUser(currentUser);
          setStoredUser(currentUser);
        } catch (error) {
          // Token is invalid, clear auth
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    setUser: (userData) => {
      setUser(userData);
      if (userData) {
        setStoredUser(userData);
      }
    },
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};