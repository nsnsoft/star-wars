import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "root/context/UserContext";

const GuardedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        return user.accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default GuardedRoute;
