import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { NotificationServiceClient } from "@buf/budgetplanner_proto";

export type NotificationClient = InstanceType<typeof grpc.Client>;

export function useNotificationClient(): NotificationClient {
  const url = process.env.NOTIFICATION_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated NotificationServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
