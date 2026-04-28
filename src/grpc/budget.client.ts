import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { BudgetServiceClient } from "@buf/budgetplanner_proto";

export type BudgetClient = InstanceType<typeof grpc.Client>;

export function useBudgetClient(): BudgetClient {
  const url = process.env.BUDGET_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated BudgetServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
