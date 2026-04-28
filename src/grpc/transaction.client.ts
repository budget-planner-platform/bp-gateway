import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { TransactionServiceClient } from "@buf/budgetplanner_proto";

export type TransactionClient = InstanceType<typeof grpc.Client>;

export function useTransactionClient(): TransactionClient {
  const url = process.env.TRANSACTION_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated TransactionServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
