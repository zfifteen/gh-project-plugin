import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer(
  {
    name: 'gh-project-plugin',
    version: '0.1.0'
  },
  {
    capabilities: {}
  }
);

server.registerTool(
  'preview_gh_project_menu',
  {
    description: 'Probe native Codex menu rendering by asking for one .gitignore choice.',
    inputSchema: {}
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: 'form',
      message: 'Choose the .gitignore template for this GitHub repository.',
      requestedSchema: {
        type: 'object',
        properties: {
          gitignoreTemplate: {
            type: 'string',
            title: '.gitignore',
            description: 'Select the .gitignore template to include during repository creation.',
            oneOf: [
              {
                const: 'none',
                title: 'None (Recommended)'
              },
              {
                const: 'macos',
                title: 'macOS'
              },
              {
                const: 'specify',
                title: 'Specify'
              }
            ],
            default: 'none'
          }
        },
        required: [
          'gitignoreTemplate'
        ]
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
