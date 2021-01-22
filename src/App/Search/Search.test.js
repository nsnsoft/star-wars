import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserContext from "root/context/UserContext";
import { searchPlanets } from "root/api";
import Search from "./Search";

jest.mock("root/api", () => ({
  __esModule: true,
  searchPlanets: jest.fn(),
}));

describe("Search", () => {
  test("renders Search form", async () => {
    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );
    const searchHeader = await screen.getByText(/Search Planets/i);
    expect(searchHeader).toBeInTheDocument();
  });

  test("shows pending indicator while user keys in", async () => {
    searchPlanets.mockImplementation(
      //delay return so that pending indicator shows in screen
      () => new Promise((resolve) => setTimeout(() => resolve([]), 500))
    );
    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "a" } });

    //compensating debounce
    await waitFor(
      () => {
        expect(screen.getByTestId("pendingIndicator")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });

  test("searches and renders Planets list", async () => {
    searchPlanets.mockImplementation(async () => {
      return {
        planets: [
          { name: "Stewjon", population: "100" },
          { name: "Seoth", population: "200" },
        ],
      };
    });
    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "S" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("S", "fakeToken");
        expect(screen.getByText("Stewjon")).toBeInTheDocument();
        expect(screen.getByText("Seoth")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });

  test("sorts the result", async () => {
    searchPlanets.mockImplementation(async () => {
      return {
        planets: [
          { name: "planet1", population: "100" },
          { name: "planet3", population: "300" },
          { name: "planet2", population: "200" },
        ],
      };
    });
    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "p" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("p", "fakeToken");
        const sortedOrder = ["planet1", "planet2", "planet3"];
        const planetList = screen.getAllByTestId("planetName");
        planetList.forEach((planetNameNode, index) => {
          expect(planetNameNode.textContent).toBe(sortedOrder[index]);
        });
      },
      { timeout: 1200 }
    );
  });

  test("renders not found message when search result is empty", async () => {
    searchPlanets.mockImplementation(async () => {
      return { planets: [] };
    });
    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "S" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("S", "fakeToken");
        expect(screen.getByText("No planets found!")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });

  test("renders appropriate message for unlimited plan", () => {
    render(
      <UserContext.Provider
        value={{
          user: { name: "tester", accessToken: "fakeToken", plan: "unlimited" },
        }}
      >
        <Search />
      </UserContext.Provider>
    );
    expect(
      screen.getByText("tester, you can have unlimited searches")
    ).toBeInTheDocument();
  });

  test("render appropriate message for limited plan", () => {
    render(
      <UserContext.Provider
        value={{
          user: { name: "tester", accessToken: "fakeToken", plan: "plan-5" },
        }}
      >
        <Search />
      </UserContext.Provider>
    );
    expect(
      screen.getByText("tester, your search is limited to 5 per minute")
    ).toBeInTheDocument();
  });

  test("renders error thrown from api", async () => {
    searchPlanets.mockImplementation(async () => {
      throw new Error("User quota reached");
    });

    render(
      <UserContext.Provider
        value={{ user: { accessToken: "fakeToken", plan: "unlimited" } }}
      >
        <Search />
      </UserContext.Provider>
    );

    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "a" } });
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("a", "fakeToken");
        expect(screen.getByText("User quota reached")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });
});
