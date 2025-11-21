import React from 'react';
import { TableData } from '../types';

interface TablePreviewProps {
  data: TableData;
}

export const TablePreview: React.FC<TablePreviewProps> = ({ data }) => {
  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 text-sm truncate" title={data.title}>
          {data.title}
        </h3>
      </div>
      <div className="overflow-x-auto max-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200 text-sm" id="generated-table">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {data.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-left font-medium text-gray-600 tracking-wider border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-blue-50 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-3 py-2 whitespace-nowrap text-gray-700 border-r border-gray-200 last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.summary && (
        <div className="bg-yellow-50 p-3 text-xs text-gray-600 border-t border-gray-200 italic">
           💡 {data.summary}
        </div>
      )}
    </div>
  );
};
