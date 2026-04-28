import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { CurrencyServiceClient } from "@buf/budgetplanner_proto";

export type CurrencyClient = InstanceType<typeof grpc.Client>;

export function useCurrencyClient(): CurrencyClient {
  const url = process.env.CURRENCY_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated CurrencyServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
