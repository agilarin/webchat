import {ReactNode} from "react";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {Navigate} from "react-router";


interface PrivateRouteProps {
  children?: ReactNode;
}

export function PrivateRoute({children}: PrivateRouteProps) {
  const {currentUser, isSuccess} = useAuthContext();


  if (isSuccess) {
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