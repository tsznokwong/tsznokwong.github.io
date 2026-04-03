import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

describe("App smoke test", () => {
  it("vitest is working", () => {
    expect(1 + 1).toBe(2);
  });
});

