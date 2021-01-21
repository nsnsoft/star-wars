import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { searchPlanets } from "root/api";
import Search from "./Search";

jest.mock("root/api", () => ({
  __esModule: true,
  searchPlanets: jest.fn(),
}));

describe("Search", () => {
  test("renders Search form", async () => {
    render(<Search />);
    const searchHeader = await screen.getByText(/Search Planets/i);
    expect(searchHeader).toBeInTheDocument();
  });

  test("searches and renders Planets list", async () => {
    searchPlanets.mockImplementation(async () => {
      return [
        { name: "Stewjon", population: "100" },
        { name: "Seoth", population: "200" },
      ];
    });
    render(<Search />);
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "S" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("S");
        expect(screen.getByText("Stewjon")).toBeInTheDocument();
        expect(screen.getByText("Seoth")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });

  test("renders not found message when search result is empty", async () => {
    searchPlanets.mockImplementation(async () => {
      return [];
    });
    render(<Search />);
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "S" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("S");
        expect(screen.getByText("No planets found!")).toBeInTheDocument();
      },
      { timeout: 1200 }
    );
  });

  test("sorts the result", async () => {
    searchPlanets.mockImplementation(async () => {
      return [
        { name: "planet1", population: "100" },
        { name: "planet3", population: "300" },
        { name: "planet2", population: "200" },
      ];
    });
    render(<Search />);
    const input = screen.getByPlaceholderText("Type to search");
    fireEvent.change(input, { target: { value: "p" } });
    //compensating debounce
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("p");
        const sortedOrder = ["planet1", "planet2", "planet3"];
        const planetList = screen.getAllByTestId("planetName");
        planetList.forEach((planetNameNode, index) => {
          expect(planetNameNode.textContent).toBe(sortedOrder[index]);
        });
      },
      { timeout: 1200 }
    );
  });
});
