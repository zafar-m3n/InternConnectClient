import { classNames } from '../lib/ui';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={classNames('card', className)} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={classNames('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={classNames('px-6 py-4', className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={classNames('px-6 py-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;