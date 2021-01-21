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
        <UserContext.Provider value={{ user: { isLoggedIn: false } }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const loginHeader = screen.getByText(/Please Login/i);
    expect(loginHeader).toBeInTheDocument();
  });

  test("redirects to search page when user is logged in", async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { isLoggedIn: true } }}>
          <Login />
          <Route path="/search" render={() => <div>Mock Search Page</div>} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const searchPageContent = await screen.getByText("Mock Search Page");
    expect(searchPageContent).toBeInTheDocument();
  });

  test("should display error message thrown from login", async () => {
    login.mockImplementation(async () => {
      throw "Fields cannot be left blank!";
    });
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{ user: { isLoggedIn: false }, setUser: () => true }}
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

    expect(login).toBeCalledWith("Luke Skywalker", "19BBY");
    expect(
      screen.getByText("Fields cannot be left blank!")
    ).toBeInTheDocument();
  });
});
