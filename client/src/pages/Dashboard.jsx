import React, { useEffect, useState } from "react";

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
  });

  // Simulate fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      // Mock data - replace with real API calls
      setStats({
        totalPosts: 42,
        totalComments: 128,
        totalViews: 1024,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Posts</h2>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Comments</h2>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Views</h2>
          <p className="text-3xl font-bold">{stats.totalViews}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
