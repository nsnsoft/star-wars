import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import UserContext from "root/context/UserContext";
import { login } from "root/api";

jest.mock("root/api", () => ({
  __esModule: true,
  login: jest.fn(),
}));

import Login from "./Login";

describe("Login", () => {
  test("renders login form when user is not logged in", () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { accessToken: null } }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const loginHeader = screen.getByText(/Please Login/i);
    expect(loginHeader).toBeInTheDocument();
  });

  test("redirects to search page when user have accessToken", async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { accessToken: "fakeToken" } }}>
          <Login />
          <Route path="/search" render={() => <div>Mock Search Page</div>} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const searchPageContent = await screen.findByText("Mock Search Page");
    expect(searchPageContent).toBeInTheDocument();
  });

  test("should display error message thrown from login api", async () => {
    login.mockImplementation(async () => {
      throw new Error("Fields cannot be left blank!");
    });
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{ user: { accessToken: null }, setUser: () => true }}
        >
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const button = screen.getByText("Login");
    expect(button).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(button);
    });

    expect(login).toBeCalledWith("", "");
    expect(
      screen.getByText("Fields cannot be left blank!")
    ).toBeInTheDocument();
  });

  test("should call setUser after successful login", async () => {
    login.mockImplementation(async () => {
      return { accessToken: "fakeToken", plan: "unlimited" };
    });
    const setUser = jest.fn();
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { accessToken: null }, setUser }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const button = screen.getByText("Login");
    expect(button).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("User Name"), {
      target: { value: "Luke" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass" },
    });
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(login).toBeCalledWith("Luke", "pass");
    expect(setUser).toBeCalledWith({
      accessToken: "fakeToken",
      name: "Luke",
      plan: "unlimited",
    });
  });
});
