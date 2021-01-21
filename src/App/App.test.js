import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders star wars header", () => {
  render(<App />);
  const linkElement = screen.getByText(/Star Wars/i);
  expect(linkElement).toBeInTheDocument();
});
