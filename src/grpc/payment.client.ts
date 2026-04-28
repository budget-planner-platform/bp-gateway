import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { PaymentServiceClient } from "@buf/budgetplanner_proto";

export type PaymentClient = InstanceType<typeof grpc.Client>;

export function usePaymentClient(): PaymentClient {
  const url = process.env.PAYMENT_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated PaymentServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
