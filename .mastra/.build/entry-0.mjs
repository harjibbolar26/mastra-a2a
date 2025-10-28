import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { registerApiRoute } from '@mastra/core/server';
import { randomUUID } from 'crypto';

const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name")
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string()
  }),
  execute: async ({ context }) => {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(context.location)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();
    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${context.location}' not found`);
    }
    const { latitude, longitude, name } = geocodingData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windGust: data.current.wind_gusts_10m,
      //   conditions: getWeatherCondition(data.current.weather_code),
      conditions: data.current.weather_code,
      location: name
    };
  }
});

const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.

      Use the weatherTool to fetch current weather data.
`,
  model: "google/gemini-2.0-flash",
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db"
    })
  })
});

const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");
      const body = await c.req.json();
      const { jsonrpc, id: requestId, params } = body;
      if (jsonrpc !== "2.0" || !requestId) {
        return c.json({
          jsonrpc: "2.0",
          id: requestId || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0" and id is required'
          }
        }, 400);
      }
      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json({
          jsonrpc: "2.0",
          id: requestId,
          error: {
            code: -32602,
            message: `Agent '${agentId}' not found`
          }
        }, 404);
      }
      const { message, messages, contextId, taskId} = params || {};
      let messagesList = [];
      if (message) {
        messagesList = [message];
      } else if (messages && Array.isArray(messages)) {
        messagesList = messages;
      }
      const mastraMessages = messagesList.map((msg) => ({
        role: msg.role,
        content: msg.parts?.map((part) => {
          if (part.kind === "text") return part.text;
          if (part.kind === "data") return JSON.stringify(part.data);
          return "";
        }).join("\n") || ""
      }));
      const response = await agent.generate(mastraMessages);
      const agentText = response.text || "";
      const artifacts = [
        {
          artifactId: randomUUID(),
          name: `${agentId}Response`,
          parts: [{ kind: "text", text: agentText }]
        }
      ];
      if (response.toolResults && response.toolResults.length > 0) {
        artifacts.push({
          artifactId: randomUUID(),
          name: "ToolResults",
          parts: response.toolResults.map((result) => ({
            kind: "data",
            data: result
          }))
        });
      }
      const history = [
        ...messagesList.map((msg) => ({
          kind: "message",
          role: msg.role,
          parts: msg.parts,
          messageId: msg.messageId || randomUUID(),
          taskId: msg.taskId || taskId || randomUUID()
        })),
        {
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: agentText }],
          messageId: randomUUID(),
          taskId: taskId || randomUUID()
        }
      ];
      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: taskId || randomUUID(),
          contextId: contextId || randomUUID(),
          status: {
            state: "completed",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            message: {
              messageId: randomUUID(),
              role: "agent",
              parts: [{ kind: "text", text: agentText }],
              kind: "message"
            }
          },
          artifacts,
          history,
          kind: "task"
        }
      });
    } catch (error) {
      return c.json({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: "Internal error",
          data: { details: error.message }
        }
      }, 500);
    }
  }
});

const mastra = new Mastra({
  agents: {
    weatherAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "debug"
  }),
  observability: {
    default: {
      enabled: true
    }
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true
    },
    apiRoutes: [a2aAgentRoute]
  }
});

export { mastra };
