import React, { useEffect, useState } from "react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  dateOfHire: string;
  salary: number;
  isHRAdmin: boolean;
}

interface EmployeeTableProps {
  isUserHRAdmin: boolean;
  employees: Employee[];
  onUpdate: (employee: Employee) => void;
  onDelete: (selectedEmployeeIds: number[]) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  onUpdate,
  onDelete,
  employees,
  isUserHRAdmin,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]); // State to track selected employees
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null); // State to track hovered employee

  // Handle selection of an employee
  const toggleSelectEmployee = (employeeId: number) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  // Handle delete selected employees
  const handleDelete = () => {
    onDelete(selectedEmployees);
    setSelectedEmployees([]); // Clear selection after delete
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]); // Deselect all if all are selected
    } else {
      setSelectedEmployees(employees.map((employee) => employee.id)); // Select all
    }
  };

  const triggerOnUpdate = (employee: Employee) => {
    if (isUserHRAdmin) {
      onUpdate(employee);
    }
  };

  const convertToShortDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    // Format the date to DD/MM/YYYY
    const formattedDateTime = `${String(date.getDate()).padStart(
      2,
      "0"
    )}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

    return formattedDateTime;
  };

  const formatNumberWithCommas = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        {isUserHRAdmin && (
          <div className="text-gray-700">
            {selectedEmployees.length > 0 ? (
              <>
                <span>{selectedEmployees.length} record(s) selected</span>
                <button
                  onClick={handleDelete}
                  className="ml-4 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete Selected
                </button>
              </>
            ) : (
              <span>No records selected</span>
            )}
          </div>
        )}
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {isUserHRAdmin && (
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === employees.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              First Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Last Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Email
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Phone
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Position
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Date Of Hire
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Salary
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className={`relative border-t md:table-row hover:bg-gray-200 transition-all duration-150 ${
                isUserHRAdmin && "cursor-pointer"
              } ${
                selectedEmployees.includes(employee.id) ? "bg-gray-300" : ""
              }`}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName !== "INPUT") {
                  triggerOnUpdate(employee); // Update employee if not clicking on the checkbox
                }
              }}
              onMouseEnter={() => setHoveredEmployee(employee.id)}
              onMouseLeave={() => setHoveredEmployee(null)}
            >
              {isUserHRAdmin && (
                <td
                  className="px-4 py-4"
                  onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on checkbox
                >
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => toggleSelectEmployee(employee.id)} // Select employee for deletion
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                </td>
              )}
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  First Name:{" "}
                </span>
                {employee.firstName}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Last Name:{" "}
                </span>
                {employee.lastName}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Email:{" "}
                </span>
                {employee.email}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Phone:{" "}
                </span>
                {employee.phoneNumber}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Position:{" "}
                </span>
                {employee.position}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Date Of Hire:{" "}
                </span>
                {convertToShortDateTime(employee.dateOfHire)}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Salary:{" "}
                </span>
                ${formatNumberWithCommas(employee.salary)}
              </td>
              <td className="block md:table-cell px-6 py-4">
                <span className="md:hidden font-bold text-gray-600">
                  Role:{" "}
                </span>
                {employee.isHRAdmin ? "HR Administrator" : "Employee"}
              </td>

              {/* Tooltip */}
              {hoveredEmployee === employee.id && isUserHRAdmin && (
                <div className="absolute -top-10 left-1/2 bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg">
                  Click to update {employee.firstName} {employee.lastName}
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
