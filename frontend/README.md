# Frontend

## Route Tree

Routes are manually configured in `src/app/routeTree.tsx` using TanStack Router's manual API (`createRootRoute`, `createRoute`).

Page components are exported from:
- `src/app/index.tsx` - IndexPage
- `src/app/login.tsx` - LoginPage
- `src/app/offerings.tsx` - OfferingsPage

The route tree is imported by `src/app/router.tsx` to configure the router.
