import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  getEmployees,
  updateEmployee,
  addEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import EmployeeFormModal from "./EmployeeFormModal";
import ConfirmModal from "../../components/ConfirmModal/inde";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [modelData, setModelData] = useState(null);
  const [deleteModelData, setDeleteModelData] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (filter) {
      const filteredEmployees = employees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(filter.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(filter.toLowerCase())
      );
      setEmployees(filteredEmployees);
    } else {
      fetchEmployees();
    }
  }, [filter]);

  const fetchEmployees = () => {
    // Fetch employees from the server
    getEmployees()
      .then((res) => {
        if (res.ok) {
          setEmployees(res.resData);
        }
      })
      .catch((err) => alert(err));
  };

  const handleAddEmployee = () => {
    // Handle add employee logic here
    setModelData({}); // Open the modal with empty data
  };

  const handleSaveEmployee = (data) => {
    if (data.id) {
      // Handle update employee logic here
      updateEmployee(data).then((res) => {
        if (res.ok) {
          fetchEmployees();
          setModelData(null);
        } else {
          alert(res.resData.errors.msg);
        }
      });
    } else {
      // Handle save employee logic here
      addEmployee(data).then((res) => {
        if (res.ok) {
          fetchEmployees();
          setModelData(null);
        } else {
          alert(res.resData.errors.msg);
        }
      });
    }
    // Handle save employee logic here
  };

  const handleDeleteEmployee = (id) => {
    // Handle delete employee logic
    deleteEmployee(id).then((res) => {
      if (res.ok) {
        fetchEmployees();
        setDeleteModelData(null);
      } else {
        alert(res.resData.errors.msg);
      }
    });
  };
  return (
    <div className="p-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Manage Employee</h1>

      {/* Page Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          Number of Employees:{" "}
          <span className="font-semibold">{employees.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FontAwesomeIcon
              icon={["fa", "search"]}
              className="absolute top-3 right-3 text-gray-500"
            />
          </div>
          <button
            onClick={handleAddEmployee}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <FontAwesomeIcon icon={["fa", "plus"]} className="mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee List */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 border-b border-gray-300">
                {`${employee.firstName} ${employee.lastName}`}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {employee.email}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {employee.status}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setModelData(employee)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline ml-4"
                  onClick={() => setDeleteModelData(employee)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modelData && (
        <EmployeeFormModal
          isOpen={true}
          onClose={() => setModelData(null)}
          data={modelData}
          onSubmit={handleSaveEmployee}
        />
      )}
      {deleteModelData && (
        <ConfirmModal
          isOpen={true}
          title={`Delete Employee: ${deleteModelData.firstName} ${deleteModelData.lastName}`}
          message="Are you sure you want to delete this employee?"
          onConfirm={() => handleDeleteEmployee(deleteModelData.id)}
          onClose={() => setDeleteModelData(null)}
        />
      )}
    </div>
  );
};

export default Employee;
