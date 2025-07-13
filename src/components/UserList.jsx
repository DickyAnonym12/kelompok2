import React, { useEffect, useState } from 'react';
import PageHeader from "../components/PageHeader";
import usersData from "../assets/users.json"; // pastikan path sesuai

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    setUsers(usersData.users || []);
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="px-3 sm:px-4">
      <PageHeader title="User List" breadcrumb={["Users", "User List"]}>
              <button onClick={() => window.location.href = ""}className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg mr-2 text-sm sm:text-base">Add Users</button>
              <button className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg mr-2 text-sm sm:text-base">Export</button>
              <button onClick={() => window.location.href = "/"} className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">Kembali</button>
            </PageHeader>

      <div className="max-w-6xl mx-auto mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Phone</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Gender</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Address</th>
                <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{user.id}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{user.email}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{user.phone}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm capitalize">{user.gender}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                    {user.address?.address}, {user.address?.city}, {user.address?.state}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm uppercase font-semibold text-green-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 sm:mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-md text-white text-sm sm:text-base ${
              currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 rounded-md text-white text-sm sm:text-base ${
              currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
