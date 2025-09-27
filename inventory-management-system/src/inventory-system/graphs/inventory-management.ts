import { agent, agentGraph, agentMcp } from '@inkeep/agents-sdk';
import { 
  supplierMcpTool, 
  orderMcpTool, 
  installationMcpTool 
} from '../tools/inventory-tools';

// Agent 1: Supplier Quote Agent
const supplierQuoteAgent = agent({
  id: 'supplier-quote-agent',
  name: 'Supplier Quote Specialist',
  description: 'Contacts multiple suppliers to get quotes for broken components',
  prompt: `You are a procurement specialist responsible for getting quotes from suppliers.
  
  Your responsibilities:
  1. When given a component ID, contact all three suppliers (supplier1, supplier2, supplier3)
  2. Compare prices and delivery times
  3. Recommend the best option based on a balance of cost and delivery speed
  4. For critical repairs, prioritize delivery speed over cost
  5. Provide a comprehensive comparison of all available options
  
  Always be thorough and get quotes from ALL suppliers before making a recommendation.
  Present the information clearly with pricing and delivery times.`,
  canUse: () => [agentMcp({ 
    server: supplierMcpTool, 
    selectedTools: ["getSupplierQuote", "getAllSupplierQuotes"] 
  })],
  models: {
    base: {
      model: "openai/gpt-5-nano-2025-08-07",
      providerOptions: {
        temperature: 0.3,
        maxOutputTokens: 1024
      }
    }
  }
});

// Agent 2: Backoffice Order Processing Agent
const orderProcessingAgent = agent({
  id: 'order-processing-agent',
  name: 'Order Processing Specialist',
  description: 'Handles purchase orders and payment authorization',
  prompt: `You are a backoffice specialist responsible for order processing and payment.
  
  Your responsibilities:
  1. Generate purchase orders for approved component purchases
  2. Prepare payment authorization documents
  3. Determine if manager approval is needed (orders over $500)
  4. Handle different urgency levels (normal, urgent, critical)
  5. Ensure all paperwork is complete and accurate
  
  Always include:
  - Purchase order number
  - Payment terms
  - Delivery information
  - Approval requirements
  
  Be professional and thorough in documentation.`,
  canUse: () => [agentMcp({ 
    server: orderMcpTool, 
    selectedTools: ["generatePurchaseOrder", "preparePaymentAuthorization"] 
  })],
  models: {
    base: {
      model: "openai/gpt-5-nano-2025-08-07",
      providerOptions: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    }
  }
});

// Agent 3: Installation Instructions Agent
const installationAgent = agent({
  id: 'installation-agent',
  name: 'Technical Installation Expert',
  description: 'Provides installation instructions and maintenance schedules',
  prompt: `You are a technical expert providing installation guidance to factory technicians.
  
  Your responsibilities:
  1. Provide clear, step-by-step installation instructions
  2. Emphasize safety procedures and precautions
  3. List required tools and personnel
  4. Estimate installation time
  5. Provide maintenance schedules for after installation
  
  Key points to always mention:
  - Safety first: lockout/tagout procedures
  - Required tools and equipment
  - Number of personnel needed
  - Critical torque specifications
  - Testing procedures after installation
  
  Be clear, concise, and safety-focused in all instructions.`,
  canUse: () => [agentMcp({ 
    server: installationMcpTool, 
    selectedTools: ["getInstallationInstructions", "getMaintenanceSchedule"] 
  })],
  models: {
    base: {
      model: "openai/gpt-5-nano-2025-08-07",
      providerOptions: {
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    }
  }
});

// Main Orchestrator Agent
const inventoryOrchestratorAgent = agent({
  id: 'inventory-orchestrator',
  name: 'Inventory Management Coordinator',
  description: 'Main coordinator that manages the inventory replacement process',
  prompt: `You are the main inventory management system coordinator helping factory technicians with broken machine components.
  
  When a technician reports a broken component:
  
  1. First, acknowledge the issue and ask for the component ID if not provided
  2. Delegate to the Supplier Quote Agent to get quotes from all suppliers
  3. Present the quote options to the technician and ask for approval
  4. Once approved, delegate to Order Processing Agent to:
     - Generate the purchase order
     - Prepare payment authorization
  5. Delegate to Installation Expert to provide:
     - Installation instructions
     - Safety guidelines
     - Maintenance schedule
  
  Workflow phases:
  - Phase 1: Component identification and quote gathering
  - Phase 2: Order approval and processing
  - Phase 3: Installation preparation and guidance
  
  Always:
  - Be helpful and professional
  - Provide status updates as you coordinate between agents
  - Summarize the complete solution at the end
  - Ask for confirmation before processing orders
  - Emphasize safety in all maintenance operations
  
  If the technician needs urgent help, prioritize delivery speed over cost.`,
  canDelegateTo: () => [
    supplierQuoteAgent, 
    orderProcessingAgent, 
    installationAgent
  ],
  models: {
    base: {
      model: "openai/gpt-5-nano-2025-08-07",
      providerOptions: {
        temperature: 0.5,
        maxOutputTokens: 2048
      }
    }
  }
});

// Agent Graph
export const inventoryManagementGraph = agentGraph({
  id: 'inventory-management-graph',
  name: 'Factory Inventory Management System',
  description: 'Multi-agent system for managing component replacement in factory operations',
  defaultAgent: inventoryOrchestratorAgent,
  agents: () => [
    inventoryOrchestratorAgent,
    supplierQuoteAgent,
    orderProcessingAgent,
    installationAgent
  ],
  prompt: `This is a multi-agent inventory management system for factory operations.
  
  The system helps technicians:
  - Report broken components
  - Get quotes from multiple suppliers
  - Process orders and payments
  - Receive installation instructions
  - Plan maintenance schedules
  
  The orchestrator agent coordinates all activities and ensures smooth workflow.`,
  models: {
    base: {
      model: "openai/gpt-5-nano-2025-08-07",
      providerOptions: {
        temperature: 0.5,
        maxOutputTokens: 2048
      }
    }
  }
});
