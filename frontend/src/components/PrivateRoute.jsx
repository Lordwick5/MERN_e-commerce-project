import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ adminOnly = false }) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
