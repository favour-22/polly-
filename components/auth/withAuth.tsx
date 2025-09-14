"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const withAuth = (WrappedComponent, { redirectPath = '/login' } = {}) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || user.app_metadata?.role !== 'admin')) {
        router.push(redirectPath);
      }
    }, [user, loading, router]);

    if (loading || !user || user.app_metadata?.role !== 'admin') {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
