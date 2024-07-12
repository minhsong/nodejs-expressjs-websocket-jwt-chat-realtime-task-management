import React from "react";

const employees = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", status: "Active" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob.brown@example.com",
    status: "Inactive",
  },
];

const EmployeeTable = () => {
  const handleEdit = (id) => {
    console.log(`Edit employee with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete employee with id: ${id}`);
  };

  return (
    <div className="w-full mx-auto mt-2">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Employee Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="text-center border-b">
              <td className="py-2 px-4">{employee.name}</td>
              <td className="py-2 px-4">{employee.email}</td>
              <td className="py-2 px-4">{employee.status}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(employee.id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
