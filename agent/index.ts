import { Agent, McpClient } from "@strands-agents/sdk";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import "dotenv/config";

const honeycombMcp = new McpClient({
  transport: new StdioClientTransport({
    command: "npx",
    args: [
      "-y",
      "mcp-remote",
      "https://mcp.honeycomb.io/mcp",
      "--header",
      `Authorization: Bearer ${process.env.HONEYCOMB_MCP_API_KEY}`,
    ],
  }),
});

const agent = new Agent({
  systemPrompt:
    "あなたはHoneycombのオブザーバビリティデータを分析するアシスタントです。",
  tools: [honeycombMcp],
});

// 引数をプロンプトとして受け取る
const query = process.argv[2] || "What tools are available?";
await agent.invoke(query);

await honeycombMcp.disconnect();
