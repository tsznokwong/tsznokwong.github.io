import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

vi.mock("react-globe.gl", () => ({
  default: () => null
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(
       <BrowserRouter>
         <App />
       </BrowserRouter>
        );
     });

  it("renders navigation with Joshua title", () => {
    render(
       <BrowserRouter>
         <App />
       </BrowserRouter>
        );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/Joshua/i);
       });

  it("renders menu button", () => {
    render(
       <BrowserRouter>
         <App />
       </BrowserRouter>
        );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
       });
});
