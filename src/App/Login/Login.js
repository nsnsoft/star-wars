import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import UserContext from "root/context/UserContext";
import { Input, Button } from "root/components";
import { login } from "root/api";
import "./Login.css";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [userName, password]);

  if (user.accessToken) {
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
            const { accessToken, plan } = await login(userName, password);
            setUser({
              name: userName,
              accessToken,
              plan,
            });
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
          password
        />
        {error && <span className="login__error">{error}</span>}
        <Button disabled={pending} label="Login" type="submit" />
      </form>
    </div>
  );
};

export default Login;
