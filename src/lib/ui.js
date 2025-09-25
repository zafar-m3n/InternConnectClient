export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const toSentenceCase = (s = "") => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
};

export const statusBadge = (status) => {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    reviewing: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    interviewed: 'bg-indigo-100 text-indigo-800',
    accepted: 'bg-green-100 text-green-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    closed: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  };
  
  return variants[status] || 'bg-gray-100 text-gray-800';
};