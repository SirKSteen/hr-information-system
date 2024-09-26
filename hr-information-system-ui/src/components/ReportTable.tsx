import React, { useState } from "react";

interface Report {
  id: string;
  title: string;
  created: string;
}

interface ReportTableProps {
  onView: (report: Report) => void;
  reports: Report[];
}

const ReportTable: React.FC<ReportTableProps> = ({ onView, reports }) => {
  const [hoveredReport, setHoveredReport] = useState<string | null>(null); // State to track hovered employee

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-1 py-2 text-left hidden md:table-cell"></th>
            <th className="px-6 py-2 text-left hidden md:table-cell">Title</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr
              key={report.id}
              className={`relative border-t md:table-row hover:bg-gray-200 transition-all duration-150 cursor-pointer
              }`}
              onClick={() => onView(report)}
              onMouseEnter={() => setHoveredReport(report.id)} // Show tooltip when mouse enters
              onMouseLeave={() => setHoveredReport(null)} // Hide tooltip when mouse leaves>
            >
              <td className="block md:table-cell px-6 py-4">{index+1}</td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Title:{" "}
                </span>
                {report.title}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Created:{" "}
                </span>
                {new Date(report.created).toLocaleDateString()}
              </td>
              {/* Tooltip */}
              {hoveredReport === report.id && (
                <div className="absolute -top-10 left-1/2 bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg">
                  Click to view {report.title}
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
