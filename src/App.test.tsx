import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);

  const headingElement = screen.getByRole("heading", { name: /contact list/i });
  expect(headingElement).toBeInTheDocument();

  // Assert that the "Create contact" button/link is rendered
  const createContactLink = screen.getByRole("link", {
    name: /create contact/i,
  });
  expect(createContactLink).toBeInTheDocument();
  expect(createContactLink.getAttribute("href")).toBe("/add");

  // Assert that the "Sorry, no contacts found" message is rendered
  const noContactsMessage = screen.getByText(/sorry, no contacts found/i);
  expect(noContactsMessage).toBeInTheDocument();
  // expect(linkElement).toBeInTheDocument();
});
