import React from "react";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {Navigate} from "react-router";


interface PrivateRouteProps {
  children?: React.ReactNode;
}

function PrivateRoute({children}: PrivateRouteProps) {
  const {currentUser, isLoading} = useAuthContext();

  if (isLoading) {
    return (<></>);
  }

  if (currentUser) {
    return (
      children
    );
  }

  return (
    <Navigate to="/signin" />
  );
}

export default PrivateRoute;