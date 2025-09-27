import { defineConfig } from '@inkeep/agents-cli/config';

  const config = defineConfig({
    tenantId: "default",
    projectId: "factory-inventory-management",
    agentsManageApiUrl: 'http://localhost:3002',
    agentsRunApiUrl: 'http://localhost:3003',
    modelSettings: {
  "base": {
    "model": "openai/gpt-5-nano-2025-08-07"
  },
  "structuredOutput": {
    "model": "openai/gpt-5-nano-2025-08-07"
  },
  "summarizer": {
    "model": "openai/gpt-5-nano-2025-08-07"
  }
},
  });
      
  export default config;