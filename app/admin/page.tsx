"use client";
import React, { useEffect, useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {users.map((user) => (
              <li key={user.id} className="py-2">
                <p className="text-slate-800 dark:text-slate-200">{user.id} - {user.role}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard, { redirectPath: '/admin/login' });