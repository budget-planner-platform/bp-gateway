import * as grpc from "@grpc/grpc-js";

// TODO: import generated client from @buf/budgetplanner_proto
// import { OvdpServiceClient } from "@buf/budgetplanner_proto";

export type OvdpClient = InstanceType<typeof grpc.Client>;

export function useOvdpClient(): OvdpClient {
  const url = process.env.OVDP_SERVICE_URL ?? "localhost:50051";

  // TODO: replace with generated OvdpServiceClient
  return new grpc.Client(url, grpc.credentials.createInsecure());
}
