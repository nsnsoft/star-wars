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
    await waitFor(
      () => {
        expect(searchPlanets).toBeCalledWith("S");
        expect(screen.getByText("Stewjon")).toBeInTheDocument();
        expect(screen.getByText("Seoth")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
