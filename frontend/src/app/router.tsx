import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
