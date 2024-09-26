import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/ReportTable.tsx";
import PopUp from "../components/PopUp.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance.ts";
import Loader from "../components/Loader.tsx";

interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  isHRAdmin: boolean;
  accessToken: string;
}

interface Report {
  id: string;
  title: string;
  created: string;
}

const Reports: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpDisplayText, setPopUpDisplayText] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const userObjString = localStorage.getItem("user");
    if (userObjString != null) {
      const userObj: LoginResponse = JSON.parse(userObjString);
      setUserName(`${userObj.firstName} ${userObj.lastName}`);
    }
    // Fetch reports
    fetchReports();
  }, []);

  // Update current date/time every second
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

  const handleViewReport = async (report: any) => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get(`/report/${report.id}`, {
        responseType: "arraybuffer", // Important to set responseType for binary data
      });

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${report.title}.pdf`); // Name of the downloaded file

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
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

  const handleConfirm = () => {
    if (popUpDisplayText.includes("logout")) {
      localStorage.removeItem("user");
      navigate("/logout");
    } else if (popUpDisplayText.includes("delete")) {
      // Logic for delete reports
      setShowPopUp(false);
    }
  };

  const handleCancel = () => {
    setShowPopUp(false);
  };

  const handleNewReport = () => {
    // Toggle dropdown visibility
    setDropdownOpen((prev) => !prev);
  };

  const generateEmployeesHiredWithinLast30Days = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get(
        "/report/EmployeesHiredWithinLast30Days",
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers["content-disposition"];
      let filename = "report.pdf";

      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = contentDisposition.match(/filename="?([^";]+)"?/);
        if (matches.length > 1) {
          filename = matches[1];
        }
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
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
    setDropdownOpen(false);
    fetchReports();
  };

  const generateTotalNumberOfEmployees = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get("/report/TotalEmployees", {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers["content-disposition"];
      let filename = "report.pdf";

      if (contentDisposition && contentDisposition.includes("attachment")) {
        const matches = contentDisposition.match(/filename="?([^";]+)"?/);
        if (matches.length > 1) {
          filename = matches[1];
        }
      }

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Use the extracted filename

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
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
    setDropdownOpen(false);
    fetchReports();
  };

  const fetchReports = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axiosInstance.get<Report[]>("/report/all");
      setReports(response.data);
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
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
            onClick={() => navigate("/home")}
          >
            Home
          </button>
          <div className="relative inline-block text-left">
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
              onClick={handleNewReport}
            >
              New Report
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10">
                <div className="rounded-md bg-white shadow-xs">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => generateTotalNumberOfEmployees()}
                  >
                    Total number of employees
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => generateEmployeesHiredWithinLast30Days()}
                  >
                    Employees Hired Within Last 30 Days
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Report Table */}
      {loading ? ( // Show loader if loading
        <Loader />
      ) : (
        <div>
          <ReportTable reports={reports} onView={handleViewReport} />
        </div>
      )}
    </div>
  );
};

export default Reports;
