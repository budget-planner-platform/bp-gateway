# budget-planner-gateway — Agent Context

> For global architecture, principles, and all service descriptions see `../ARCHITECTURE.md`.

## What this repo is

GraphQL API gateway — the sole entry point for the web client. Validates Auth0 JWTs,
translates GraphQL operations into gRPC calls, and forwards user context downstream.
No business logic, no own database.

## Stack

- **Runtime:** Node.js
- **Framework:** Apollo Server v4
- **gRPC clients:** BSR SDK (`@buf/budgetplanner_proto`)
- **Auth:** Auth0 (JWKS validation via `jwks-rsa` + `jsonwebtoken`)
- **Language:** TypeScript

## Repo structure

```
budget-planner-gateway/
├── src/
│   ├── index.ts                  # Apollo Server bootstrap
│   ├── context.ts                # JWT validation, builds GQL context
│   ├── grpc/
│   │   ├── clients.ts            # initializes all gRPC clients
│   │   └── index.ts
│   ├── schema/
│   │   ├── typeDefs/             # .graphql files per domain
│   │   │   ├── user.graphql
│   │   │   ├── transaction.graphql
│   │   │   ├── category.graphql
│   │   │   ├── budget.graphql
│   │   │   ├── payment.graphql
│   │   │   ├── ovdp.graphql
│   │   │   ├── currency.graphql
│   │   │   └── notification.graphql
│   │   └── resolvers/            # resolvers per domain
│   │       ├── user.ts
│   │       ├── transaction.ts
│   │       └── ...
│   └── utils/
│       └── grpcError.ts          # maps gRPC status codes → GraphQL errors
├── .env.example
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Auth flow

1. Client sends `Authorization: Bearer <Auth0 JWT>` on every request
2. `context.ts` validates JWT signature via Auth0 JWKS endpoint (public keys cached locally)
3. `user_id` extracted from JWT `sub` claim
4. `user_id` forwarded to every downstream gRPC call via metadata: `x-user-id`
5. If token is missing or invalid → `AuthenticationError` thrown before resolvers run
6. Services never validate tokens themselves — they trust `x-user-id` from metadata

```
Request → Apollo Server → context.ts (JWT validate) → resolver → gRPC client → service
                                ↓ invalid
                          AuthenticationError
```

## gRPC client setup

All gRPC clients are initialized once at startup in `grpc/clients.ts` and injected into
Apollo context. Each client connects to its service via env var:

```typescript
// env vars pattern
USER_SERVICE_URL=user-service:50051
TRANSACTION_SERVICE_URL=transaction-service:50051
// etc.
```

## GraphQL conventions

- **Schema-first** — typeDefs in `.graphql` files, resolvers separately
- Queries and mutations map 1:1 to gRPC methods
- Monetary amounts exposed as `Float` (dollars) — converted from cents in resolvers
- Timestamps exposed as `String` (ISO 8601) — converted from `google.protobuf.Timestamp`
- IDs always `String` (UUIDs)
- gRPC errors mapped to GraphQL errors in `grpcError.ts`

## Environment variables

```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.budgetplanner.io
USER_SERVICE_URL=user-service:50051
TRANSACTION_SERVICE_URL=transaction-service:50051
CATEGORY_SERVICE_URL=category-service:50051
BUDGET_SERVICE_URL=budget-service:50051
PAYMENT_SERVICE_URL=payment-service:50051
OVDP_SERVICE_URL=ovdp-service:50051
CURRENCY_SERVICE_URL=currency-service:50051
NOTIFICATION_SERVICE_URL=notification-service:50051
PORT=4000
```

## Local development

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # ts-node with watch
```

GraphQL playground available at `http://localhost:4000/graphql`.

## Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js"]
EXPOSE 4000
```

## CI

GitHub Actions on push to `main`:
1. `npm run lint && npm run build`
2. Build and push Docker image to `ghcr.io/budgetplanner/gateway`