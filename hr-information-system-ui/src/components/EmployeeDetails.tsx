import React, { useState, useEffect } from "react";
import Loader from "./Loader.tsx";
import axios from "axios";
import axiosInstance from "../axiosInstance.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  password: string;
}

interface EmployeeDetailsProps {
  employee: Employee | null;
  onReturn: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onReturn,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");
  const [dateOfHire, setDateOfHire] = useState("");
  const [salary, setSalary] = useState("");
  const [isHrAdmin, setIsHrAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Populate form if updating an existing employee
  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setEmail(employee.email);
      setPhoneNumber(employee.phoneNumber);
      setPosition(employee.position);
      setDateOfHire(formatDateForInput(employee.dateOfHire));
      setSalary(employee.salary.toString());
      setIsHrAdmin(employee.isHRAdmin || false);
      setPassword(employee.password);
    }
  }, [employee]);

  const formatDateForInput = (isoDateString: string): string => {
    return isoDateString.split("T")[0]; // Extract only the date part
  };

  const validateInputs = () => {
    let valid = true;
    let tempErrors: any = {};

    if (!firstName) {
      tempErrors.firstName = "First name is required";
      valid = false;
    } else if (firstName.length < 2) {
      tempErrors.firstName = "First name must be at least 2 characters";
      valid = false;
    }

    if (!lastName) {
      tempErrors.lastName = "Last name is required";
      valid = false;
    } else if (lastName.length < 2) {
      tempErrors.lastName = "Last name must be at least 2 characters";
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Valid email is required";
      valid = false;
    }

    if (!phoneNumber || !/^(876\d{7}|1?876\d{7})$/.test(phoneNumber)) {
      tempErrors.phoneNumber = "Valid phone number is required";
      valid = false;
    }

    if (!position) {
      tempErrors.position = "Position is required";
      valid = false;
    } else if (position.length < 2) {
      tempErrors.firstName = "Position must be at least 2 characters";
      valid = false;
    }

    if (!dateOfHire) {
      tempErrors.dateOfHire = "Date of hire is required";
      valid = false;
    }

    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
      tempErrors.salary = "Valid positive salary is required";
      valid = false;
    }

    if (employee){
      if (!password) {
        tempErrors.password = "Password is required";
        valid = false;
      } else if (password.length < 7) {
        tempErrors.password = "Password must be at least 7 characters";
        valid = false;
      }
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      if (!employee) {
        createEmployee();
      } else {
        updateEmployee();
      }
    }
  };

  const createEmployee = async () => {
    setLoading(true); // Start loading
    try {
      const payload = {
        id: 0,
        firstName,
        lastName,
        email,
        phoneNumber,
        position,
        dateOfHire,
        salary,
        isHRAdmin: isHrAdmin,
        password: ""
      };
      const response = await axiosInstance.post("/employee", payload);
      toast.success(`${response.data.message}`, {
        position: "top-center",
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      onReturn();
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.log(err.message)
        toast.error(err.response.data.message ?? (err as Error).message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const updateEmployee = async () => {
    setLoading(true); // Start loading

    try {
      const salaryFloat = parseFloat(salary);
      const payload = {
        id: employee!.id,
        firstName,
        lastName,
        email,
        phoneNumber,
        position,
        dateOfHire:
          formatDateForInput(dateOfHire) !==
          formatDateForInput(employee!.dateOfHire)
            ? dateOfHire
            : employee!.dateOfHire,
        salary: salaryFloat,
        isHRAdmin: isHrAdmin,
        password,
      };
      const response = await axiosInstance.put(
        `/employee/${employee!.id}`,
        payload
      );
      toast.success(`${response.data.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      onReturn();
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(err.response.data.message ?? err.response.data.message ?? (err as Error).message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between w-full mb-4">
        <h2 className="text-xl font-bold">
          {employee ? "Update Employee" : "New Employee"}
        </h2>
        <button
          onClick={onReturn}
          className="text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
      </div>
      {loading ? ( // Show loader if loading
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Position */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.position ? "border-red-500" : "border-gray-300"
              }`}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            {errors.position && (
              <p className="text-red-500 text-sm">{errors.position}</p>
            )}
          </div>

          {/* Date of Hire */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Date of Hire <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.dateOfHire ? "border-red-500" : "border-gray-300"
              }`}
              value={dateOfHire}
              onChange={(e) => setDateOfHire(e.target.value)}
            />
            {errors.dateOfHire && (
              <p className="text-red-500 text-sm">{errors.dateOfHire}</p>
            )}
          </div>

          {/* Salary */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                errors.salary ? "border-red-500" : "border-gray-300"
              }`}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm">{errors.salary}</p>
            )}
          </div>

          {/* Role (Is HR Administrator?) */}
          <div className="flex mb-4">
            <label className=" mr-2 block text-gray-700">
              Is HR Administrator? <span className="text-red-500">*</span>
            </label>
            <input
              type="checkbox"
              className="mt-1 block"
              checked={isHrAdmin}
              onChange={(e) => setIsHrAdmin(e.target.checked)}
            />
          </div>

          {/* Password */}
          {employee && (
            <div className="mb-4">
              <label className="block text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className={`mt-1 block w-full p-3 border rounded-lg shadow-sm ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {employee ? "Update Employee" : "Add Employee"}
            </button>

            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={onReturn}
            >
              Return to Employee Table
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeDetails;
