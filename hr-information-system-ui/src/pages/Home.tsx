import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import EmployeeTable from "../components/EmployeeTable.tsx";
import EmployeeDetails from "../components/EmployeeDetails.tsx";
import PopUp from "../components/PopUp.tsx";
import axiosInstance from "../axiosInstance.ts";
import axios from "axios";
import Loader from "../components/Loader.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  isHRAdmin: boolean;
  accessToken: string;
}

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

const Home: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpDisplayText, setPopUpDisplayText] = useState("");
  const [userName, setUserName] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [isUserHRAdmin, setUserRoleStatus] = useState((JSON.parse(localStorage.getItem("user")!)).isHRAdmin);

  const navigate = useNavigate();

  useEffect(() => {
    const userObjString = localStorage.getItem("user");
    if (userObjString != null) {
      const userObj: LoginResponse = JSON.parse(userObjString);
      setUserName(`${userObj.firstName} ${userObj.lastName}`);
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      validateUserRole();
    }, 10000);
  });

  const validateUserRole = () => {
    const userObjString = localStorage.getItem("user");
    if (userObjString != null) {
      const userObj: LoginResponse = JSON.parse(userObjString);
      setUserRoleStatus(userObj.isHRAdmin);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get<Employee[]>("/employee/all");
      setEmployees(response.data);
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    setShowPopUp(true);
    setPopUpDisplayText(`Are you sure you want to logout?`);
  };

  const handleViewReports = () => {
    navigate("/reports");
  };

  const handleNewEmployee = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleUpdateEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteSelectedEmployees = (selectedEmployeeIds: number[]) => {
    setSelectedEmployeeIds(selectedEmployeeIds);
    setShowPopUp(true);
    setPopUpDisplayText(
      `Are you sure you want to delete ${selectedEmployeeIds.length} record${
        selectedEmployeeIds.length !== 1 ? "s" : ""
      }?`
    );
  };

  const handleConfirm = () => {
    if (popUpDisplayText.includes("logout")) {
      localStorage.removeItem("user");
      navigate("/logout");
    } else if (popUpDisplayText.includes("delete")) {
      setLoading(true); // Start loading
      selectedEmployeeIds.forEach(async (id, _) => {
        const userObjString = localStorage.getItem("user");
        if (userObjString != null) {
          const userObj: LoginResponse = JSON.parse(userObjString);
          if (id !== userObj.id) {
            try {
              const response = await axiosInstance.delete(`/employee/${id}`);
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
              fetchEmployees();
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
          } else {
            toast.error("Cannot delete your own account", {
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
        }
      });
      setLoading(false);
      setShowPopUp(false);
    }
  };

  const handleCancel = () => {
    setShowPopUp(false);
  };

  const handleReturnToTable = () => {
    setShowForm(false);
    fetchEmployees();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {showPopUp && (
        <PopUp
          displayText={popUpDisplayText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={() => setShowPopUp(false)}
        />
      )}
      {/* Header Toolbar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow p-4 rounded-lg mb-6">
        <div>
          <p className="font-semibold">{userName}</p>
          <p>{currentDateTime.toLocaleString()}</p>
        </div>
        <div className="flex md:flex-row gap-4 mt-4 md:mt-0">
          {isUserHRAdmin && (
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
              onClick={handleViewReports}
            >
              View Reports
            </button>
          )}
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div>
        {loading ? ( // Show loader if loading
          <Loader />
        ) : showForm ? (
          <EmployeeDetails
            employee={selectedEmployee}
            onReturn={handleReturnToTable}
          />
        ) : (
          <>
            {isUserHRAdmin && (
              <button
                className="mb-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                onClick={handleNewEmployee}
              >
                New Employee
              </button>
            )}
            <EmployeeTable
              isUserHRAdmin={isUserHRAdmin}
              employees={employees}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteSelectedEmployees}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
