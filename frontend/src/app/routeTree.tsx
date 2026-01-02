import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import React from "react";

import { IndexPage } from "./index";
import { LoginPage } from "./login";
import { OfferingsPage } from "./offerings";

const RootRoute = createRootRoute({
  component: () => <Outlet />,
});

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

export const routeTree = RootRoute.addChildren([IndexRoute, LoginRoute, OfferingsRoute]);
