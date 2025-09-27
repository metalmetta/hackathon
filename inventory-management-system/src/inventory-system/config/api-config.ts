// API Configuration
// IMPORTANT: In production, use environment variables and secure key management
// This is for demonstration purposes only

export const API_CONFIG = {
  // WARNING: This API key should be stored securely in environment variables
  // Never commit API keys to version control in production
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Model Configuration
  MODEL: 'gpt-5-nano-2025-08-07',
  
  // Service URLs
  MANAGE_API_URL: process.env.INKEEP_AGENTS_MANAGE_API_URL || 'http://localhost:3002',
  RUN_API_URL: process.env.INKEEP_AGENTS_RUN_API_URL || 'http://localhost:3003',
};

// Security Note:
// In production, you should:
// 1. Use environment variables for all sensitive information
// 2. Implement proper key rotation
// 3. Use a secrets management service
// 4. Never expose API keys in client-side code
// 5. Implement rate limiting and usage monitoring
