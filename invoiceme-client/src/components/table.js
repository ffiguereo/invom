import { Fragment } from 'react';
import { useExpanded, useTable } from 'react-table';

export function Table({ columns, data, renderRowSubComponent }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns,
      data,
    },
    useExpanded,
  );
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                {rows.map((row) => {
                  prepareRow(row);
                  const rowProps = row.getRowProps();
                  return (
                    <Fragment key={rowProps.key}>
                      <tr {...rowProps}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                      {row.isExpanded ? (
                        <tr>
                          <td colSpan={visibleColumns.length}>{renderRowSubComponent({ row })}</td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
