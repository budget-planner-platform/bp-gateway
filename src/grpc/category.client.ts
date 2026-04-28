import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { CategoryServiceClient } from "@buf/budgetplanner_proto";

export type CategoryClient = InstanceType<typeof grpc.Client>;

export function useCategoryClient(): CategoryClient {
  const url = process.env.CATEGORY_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated CategoryServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
