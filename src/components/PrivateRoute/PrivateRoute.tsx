import React from "react";
import {useAuthState} from "@/hooks/useAuthState.ts";
import {Navigate} from "react-router";


interface PrivateRouteProps {
  children?: React.ReactNode;
}

function PrivateRoute({children}: PrivateRouteProps) {
  const {currentUser, isLoading} = useAuthState();

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