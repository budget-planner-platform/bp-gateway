import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { createContext } from "./context/context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  const port = Number(process.env.PORT) || 4000;

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: createContext,
  });

  console.log(`Gateway ready at ${url}`);
}

main().catch((err) => {
  console.error("Failed to start gateway:", err);
  process.exit(1);
});
