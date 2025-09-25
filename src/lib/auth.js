export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const getRole = () => {
  const user = getUser();
  return user?.role;
};

export const isAuthenticated = () => !!getToken();

export const hasRole = (roles) => {
  const userRole = getRole();
  if (!userRole) return false;
  return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
};