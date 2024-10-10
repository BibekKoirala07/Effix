import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = ({ children }) => {
  const account = useSelector((state) => state.user);
  const { isLoggedIn, loading } = account;
  if (!loading && account.user?.role !== "admin") {
    return <Redirect to="/" />;
  }

  return children;
};

export default AuthGuard;

export const TechnicianGuard = ({ children }) => {
  const account = useSelector((state) => state.user);
  const { isLoggedIn, loading } = account;
  console.log(account, "Here");
  if (!loading && account.user?.role !== "technician") {
    return <Redirect to="/" />;
  }

  return children;
};

export const UserGuard = ({ children }) => {
  const account = useSelector((state) => state.user);
  const { isLoggedIn, loading } = account;

  if (!loading && account.user?.role !== "user") {
    return <Redirect to="/" />;
  }

  return children;
};
