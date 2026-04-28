import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import { grpcClients, GrpcClients } from "../grpc";

export interface Context {
  userId: string;
  grpc: GrpcClients;
}

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(
  header: jwt.JwtHeader,
  callback: (err: Error | null, key?: string) => void
) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key?.getPublicKey());
  });
}

function verifyToken(token: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as jwt.JwtPayload);
      }
    );
  });
}

export async function createContext({
  req,
}: StandaloneServerContextFunctionArgument): Promise<Context> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new GraphQLError("Missing or malformed Authorization header", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const token = authHeader.slice(7);

  let payload: jwt.JwtPayload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const userId = payload.sub;
  if (!userId) {
    throw new GraphQLError("Token missing sub claim", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return {
    userId,
    grpc: grpcClients,
  };
}
