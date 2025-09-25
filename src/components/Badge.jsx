import { classNames, statusBadge, toSentenceCase } from '../lib/ui';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = variant === 'default' 
    ? 'bg-gray-100 text-gray-800'
    : statusBadge(variant);

  return (
    <span className={classNames(baseClasses, variantClasses, className)}>
      {toSentenceCase(children)}
    </span>
  );
};

export default Badge;