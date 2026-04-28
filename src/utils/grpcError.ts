import { GraphQLError } from "graphql";
import { status as GrpcStatus } from "@grpc/grpc-js";

const grpcToGraphQLCode: Record<number, string> = {
  [GrpcStatus.INVALID_ARGUMENT]: "BAD_USER_INPUT",
  [GrpcStatus.NOT_FOUND]: "NOT_FOUND",
  [GrpcStatus.ALREADY_EXISTS]: "ALREADY_EXISTS",
  [GrpcStatus.PERMISSION_DENIED]: "FORBIDDEN",
  [GrpcStatus.UNAUTHENTICATED]: "UNAUTHENTICATED",
  [GrpcStatus.RESOURCE_EXHAUSTED]: "RATE_LIMITED",
  [GrpcStatus.FAILED_PRECONDITION]: "FAILED_PRECONDITION",
  [GrpcStatus.UNIMPLEMENTED]: "NOT_IMPLEMENTED",
  [GrpcStatus.UNAVAILABLE]: "SERVICE_UNAVAILABLE",
  [GrpcStatus.DEADLINE_EXCEEDED]: "GATEWAY_TIMEOUT",
};

const grpcToHttpStatus: Record<number, number> = {
  [GrpcStatus.INVALID_ARGUMENT]: 400,
  [GrpcStatus.NOT_FOUND]: 404,
  [GrpcStatus.ALREADY_EXISTS]: 409,
  [GrpcStatus.PERMISSION_DENIED]: 403,
  [GrpcStatus.UNAUTHENTICATED]: 401,
  [GrpcStatus.RESOURCE_EXHAUSTED]: 429,
  [GrpcStatus.FAILED_PRECONDITION]: 400,
  [GrpcStatus.UNIMPLEMENTED]: 501,
  [GrpcStatus.UNAVAILABLE]: 503,
  [GrpcStatus.DEADLINE_EXCEEDED]: 504,
};

interface GrpcError {
  code: number;
  details?: string;
}

export function mapGrpcError(err: GrpcError): GraphQLError {
  const code = grpcToGraphQLCode[err.code] ?? "INTERNAL_SERVER_ERROR";
  const httpStatus = grpcToHttpStatus[err.code] ?? 500;
  const message = err.details ?? "An unexpected error occurred";

  return new GraphQLError(message, {
    extensions: {
      code,
      http: { status: httpStatus },
    },
  });
}
