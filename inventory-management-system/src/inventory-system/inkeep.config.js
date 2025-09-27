const { defineConfig } = require('@inkeep/agents-cli/config');

const config = defineConfig({
  tenantId: "default",
  projectId: "inventory-system",
  agentsManageApiUrl: 'http://localhost:3002',
  agentsRunApiUrl: 'http://localhost:3003',
  modelSettings: {
    "base": {
      "model": "openai/gpt-5-nano-2025-08-07",
      "providerOptions": {
        "temperature": 0.7,
        "maxOutputTokens": 2048
      }
    },
    "structuredOutput": {
      "model": "openai/gpt-5-nano-2025-08-07",
      "providerOptions": {
        "temperature": 0.2,
        "maxOutputTokens": 1024
      }
    },
    "summarizer": {
      "model": "openai/gpt-5-nano-2025-08-07",
      "providerOptions": {
        "temperature": 0.5,
        "maxOutputTokens": 512
      }
    }
  },
});

module.exports = config;
