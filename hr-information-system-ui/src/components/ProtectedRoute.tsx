import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();
  const userObjString = localStorage.getItem('user');
  const user = userObjString ? JSON.parse(userObjString) : null;

  const isAuthenticated = !!user;
  const hasAccess = user?.isHRAdmin; 

  const isReportsRoute = location.pathname === '/reports';

  if (isReportsRoute) {
    if (isAuthenticated && hasAccess) {
      return element;
    } else {
      return <Navigate to="/home" />; 
    }
  }

  return element;
};

export default PrivateRoute;
