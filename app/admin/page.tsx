"use client";
import React from 'react';
import withAuth from '@/components/auth/withAuth';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, admin!</p>
    </div>
  );
};

export default withAuth(AdminDashboard);
