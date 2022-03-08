import { expect, it } from "vitest";

import ApolloProvider from "@/lib/Apollo";
import { render, screen, userEvent } from "@/utils/test-utils";
import App from "@/App";

it("Should signup", async () => {
  render(
    <ApolloProvider>
      <App />
    </ApolloProvider>
  );

  expect(
    screen.getByRole("heading", {
      name: "Auth Demo",
      level: 1,
    })
  ).toBeDefined();

  expect(
    screen.getByRole("heading", {
      name: "Login",
      level: 2,
    })
  ).toBeDefined();

  userEvent.click(screen.getByRole("link", { name: "Sign up" }));

  expect(
    screen.getByRole("heading", {
      name: "SignUp",
      level: 2,
    })
  ).toBeDefined();
});
