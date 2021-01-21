import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import UserContext from "root/context/UserContext";
import { Input, Button } from "root/components";
import { login } from "root/api";
import "./Login.css";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [userName, setUserName] = useState("Luke Skywalker");
  const [password, setPassword] = useState("19BBY");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [userName, password]);

  if (user.isLoggedIn) {
    return <Redirect to="/search" />;
  }

  return (
    <div className="login">
      <h2>Please Login</h2>
      <form
        className="login__form"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          try {
            await login(userName, password);
            setUser({ isLoggedIn: true, name: userName });
          } catch (er) {
            setError(er.message);
            setPending(false);
          }
        }}
      >
        <Input
          value={userName}
          onChange={(value) => setUserName(value)}
          label="User Name"
        />
        <Input
          value={password}
          onChange={(value) => setPassword(value)}
          label="Password"
        />
        {error && <span className="login__error">{error}</span>}
        <Button disabled={pending} label="Login" type="submit" />
      </form>
    </div>
  );
};

export default Login;
