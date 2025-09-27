import { mcpTool } from '@inkeep/agents-sdk';

// MCP tool for email notifications and supplier communications
export const supplierMcpTool = mcpTool({
  id: 'Kz6LlJTki7ZnXWQ7fHi3G',
  name: 'Supplier Communication Tools',
  serverUrl: 'https://apollo.composio.dev/v3/mcp/954a760d-e169-4a18-a8a4-f3805142b10f/mcp?include_composio_helper_actions=true', // Email and notification MCP server
});

export const orderMcpTool = mcpTool({
  id: 'order-mcp',
  name: 'Order Processing Tools',
  serverUrl: 'https://example.com/order-mcp', // Mock URL for demo
});

export const installationMcpTool = mcpTool({
  id: 'installation-mcp',
  name: 'Installation Tools',
  serverUrl: 'https://example.com/installation-mcp', // Mock URL for demo
});
