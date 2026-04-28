import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { UserServiceClient } from "@buf/budgetplanner_proto";

export type UserClient = InstanceType<typeof grpc.Client>;

export function useUserClient(): UserClient {
  const url = process.env.USER_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated UserServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
