import { classNames } from '../lib/ui';

const Table = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={classNames('min-w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, sticky = true }) => {
  return (
    <thead className={classNames('bg-gray-50', sticky ? 'sticky top-0 z-10' : '')}>
      {children}
    </thead>
  );
};

const TableBody = ({ children }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = '', hover = true }) => {
  return (
    <tr className={classNames(
      hover ? 'hover:bg-gray-50' : '',
      'even:bg-gray-50',
      className
    )}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = '', sortable = false, onSort }) => {
  return (
    <th 
      className={classNames(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        sortable ? 'cursor-pointer hover:bg-gray-100' : '',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '' }) => {
  return (
    <td className={classNames('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;