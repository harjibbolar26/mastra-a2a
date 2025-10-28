import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherAgent } from "./agents/weatherAgent";
import { a2aAgentRoute } from "../routes/a2aRouteHandler";
import { VercelDeployer } from "@mastra/deployer-vercel";

export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "debug",
  }),
  observability: {
    default: { enabled: true },
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute],
  },
  deployer: new VercelDeployer(),
});
