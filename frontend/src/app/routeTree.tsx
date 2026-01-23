import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "./__root";
import { IndexPage } from "./index";
import { LoginPage } from "./login";
import { OfferingsPage } from "./offerings";

// Import the route exports from file-based routes
import { Route as SponsorsRoute } from "./sponsors";
import { Route as InvestorsRoute } from "./investors";
import { Route as ProvidersRoute } from "./providers";

const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: IndexPage,
});

const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/login",
  component: LoginPage,
});

const OfferingsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/offerings",
  component: OfferingsPage,
});

export const routeTree = RootRoute.addChildren([
  IndexRoute,
  LoginRoute,
  OfferingsRoute,
  SponsorsRoute,
  InvestorsRoute,
  ProvidersRoute,
]);
