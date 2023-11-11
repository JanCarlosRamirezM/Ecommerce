import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading === false &&
        (isAuthenticated ? <Outlet /> : <Navigate to="/login" />)}
    </>
  );
};
