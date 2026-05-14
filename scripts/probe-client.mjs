import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  CallToolResultSchema,
  ElicitRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

const client = new Client(
  {
    name: 'gh-project-probe-client',
    version: '0.1.0'
  },
  {
    capabilities: {
      elicitation: {
        form: {}
      }
    }
  }
);

client.setRequestHandler(ElicitRequestSchema, async (request) => {
  if (request.params.mode && request.params.mode !== 'form') {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Unsupported elicitation mode: ${request.params.mode}`
    );
  }

  const field = request.params.requestedSchema.properties.gitignoreTemplate;
  console.log('Elicitation received:');
  console.log(JSON.stringify({
    message: request.params.message,
    title: field.title,
    choices: field.oneOf.map((choice) => choice.title)
  }, null, 2));

  return {
    action: 'accept',
    content: {
      gitignoreTemplate: 'none'
    }
  };
});

const transport = new StdioClientTransport({
  command: 'node',
  args: [
    './mcp-server/server.mjs'
  ],
  cwd: process.cwd(),
  stderr: 'pipe'
});

await client.connect(transport);

try {
  const result = await client.callTool(
    {
      name: 'preview_gh_project_menu',
      arguments: {}
    },
    CallToolResultSchema
  );

  const text = result.content.find((item) => item.type === 'text')?.text;
  const parsed = JSON.parse(text);

  if (parsed.action !== 'accept') {
    throw new Error(`Expected accept action, received ${parsed.action}`);
  }

  if (parsed.content.gitignoreTemplate !== 'none') {
    throw new Error(`Expected none template, received ${parsed.content.gitignoreTemplate}`);
  }

  console.log('Probe passed: MCP form elicitation round-trip accepted gitignoreTemplate=none.');
} finally {
  await client.close();
}
