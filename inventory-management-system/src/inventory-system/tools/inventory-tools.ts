import { mcpTool } from '@inkeep/agents-sdk';
import { 
  generateSupplierQuotes, 
  generateInstallationInstructions, 
  generateMaintenanceSchedule,
  generateOrderDetails,
  extractComponentType,
  generateComponentId,
  getComponentSpec
} from './data-generators';

// Dynamic installation instructions are now generated in data-generators.ts

// MCP server for supplier queries
export const supplierMcpTool = mcpTool({
  name: 'supplier-tools',
  description: 'Tools for querying supplier quotes and availability',
  tools: {
    getSupplierQuote: {
      description: 'Get a price quote from a specific supplier for a component',
      parameters: {
        type: 'object',
        properties: {
          supplierId: { type: 'string', description: 'Supplier ID (supplier1, supplier2, supplier3)' },
          componentId: { type: 'string', description: 'Component ID to get quote for' }
        },
        required: ['supplierId', 'componentId']
      },
      execute: async ({ supplierId, componentId }) => {
        // Extract component type from ID or use the ID as type
        const componentType = extractComponentType(componentId);
        const quotes = generateSupplierQuotes(componentType, 'normal');
        
        // Find quote from specific supplier
        const supplierQuote = quotes.find(q => 
          q.supplierId === supplierId || 
          q.supplier.toLowerCase().includes(supplierId.toLowerCase())
        );
        
        if (!supplierQuote) {
          return {
            supplier: supplierId,
            componentId,
            available: false,
            message: "Component not available from this supplier"
          };
        }
        
        return {
          supplier: supplierQuote.supplier,
          componentId,
          available: true,
          price: supplierQuote.price,
          deliveryDays: supplierQuote.deliveryDays,
          currency: supplierQuote.currency,
          hasRushOption: supplierQuote.hasRushOption,
          reliability: supplierQuote.reliability
        };
      }
    },
    
    getAllSupplierQuotes: {
      description: 'Get quotes from all suppliers for a component',
      parameters: {
        type: 'object',
        properties: {
          componentId: { type: 'string', description: 'Component ID to get quotes for' }
        },
        required: ['componentId']
      },
      execute: async ({ componentId }) => {
        // Extract component type from ID or use the ID as type
        const componentType = extractComponentType(componentId);
        const quotes = generateSupplierQuotes(componentType, 'normal');
        
        if (quotes.length === 0) {
          return {
            componentId,
            message: "Component not available from any supplier",
            quotes: []
          };
        }
        
        // Convert to expected format
        const formattedQuotes = quotes.map(quote => ({
          supplierId: quote.supplierId,
          supplierName: quote.supplier,
          price: quote.price,
          deliveryDays: quote.deliveryDays,
          currency: quote.currency,
          hasRushOption: quote.hasRushOption,
          reliability: quote.reliability,
          specialty: quote.specialty
        }));
        
        return {
          componentId,
          componentType,
          quotes: formattedQuotes,
          bestOption: formattedQuotes[0],
          totalSuppliers: formattedQuotes.length
        };
      }
    }
  }
});

// MCP server for order processing
export const orderMcpTool = mcpTool({
  name: 'order-tools',
  description: 'Tools for processing orders and generating paperwork',
  tools: {
    generatePurchaseOrder: {
      description: 'Generate a purchase order for a component',
      parameters: {
        type: 'object',
        properties: {
          supplierId: { type: 'string', description: 'Supplier ID' },
          componentId: { type: 'string', description: 'Component ID' },
          quantity: { type: 'number', description: 'Quantity to order' },
          urgency: { type: 'string', description: 'Urgency level (normal, urgent, critical)' }
        },
        required: ['supplierId', 'componentId', 'quantity']
      },
      execute: async ({ supplierId, componentId, quantity = 1, urgency = 'normal' }) => {
        // Extract component type and generate order details
        const componentType = extractComponentType(componentId);
        const supplierName = supplierId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const orderDetails = generateOrderDetails(componentType, supplierName, urgency as 'normal' | 'urgent' | 'critical');
        const totalPrice = orderDetails.price * quantity;
        
        return {
          purchaseOrder: {
            orderNumber: orderDetails.orderNumber,
            date: new Date().toISOString(),
            supplier: orderDetails.supplier,
            componentId: orderDetails.componentId,
            componentType: orderDetails.componentType,
            quantity,
            unitPrice: orderDetails.price,
            totalPrice,
            currency: "USD",
            deliveryDays: orderDetails.deliveryDays,
            urgency,
            status: "GENERATED",
            paymentTerms: "Net 30",
            shippingAddress: "Factory Floor, Building A, Industrial Park",
            approvalRequired: orderDetails.approvalRequired,
            estimatedDelivery: orderDetails.estimatedDelivery,
            shippingMethod: orderDetails.shippingMethod,
            warrantyPeriod: orderDetails.warrantyPeriod
          },
          message: `Purchase order ${orderDetails.orderNumber} generated successfully`
        };
      }
    },
    
    preparePaymentAuthorization: {
      description: 'Prepare payment authorization for an order',
      parameters: {
        type: 'object',
        properties: {
          orderNumber: { type: 'string', description: 'Purchase order number' },
          totalAmount: { type: 'number', description: 'Total amount to authorize' },
          paymentMethod: { type: 'string', description: 'Payment method (credit, wire, check)' }
        },
        required: ['orderNumber', 'totalAmount']
      },
      execute: async ({ orderNumber, totalAmount, paymentMethod = 'credit' }) => {
        const authCode = `AUTH-${Date.now()}`;
        
        return {
          authorization: {
            authCode,
            orderNumber,
            amount: totalAmount,
            currency: "USD",
            paymentMethod,
            status: "PENDING_APPROVAL",
            approver: totalAmount > 500 ? "Finance Manager" : "Department Head",
            estimatedProcessing: paymentMethod === 'wire' ? "1-2 business days" : "Same day",
            bankDetails: paymentMethod === 'wire' ? {
              accountName: "Factory Operations Inc.",
              accountNumber: "****4567",
              routingNumber: "****8901"
            } : null
          },
          message: `Payment authorization ${authCode} prepared. ${totalAmount > 500 ? 'Manager approval required.' : 'Ready for processing.'}`
        };
      }
    }
  }
});

// MCP server for installation instructions
export const installationMcpTool = mcpTool({
  name: 'installation-tools',
  description: 'Tools for providing installation instructions',
  tools: {
    getInstallationInstructions: {
      description: 'Get installation instructions for a component',
      parameters: {
        type: 'object',
        properties: {
          componentId: { type: 'string', description: 'Component ID' },
          includeVideo: { type: 'boolean', description: 'Include video tutorial link' }
        },
        required: ['componentId']
      },
      execute: async ({ componentId, includeVideo = false }) => {
        // Extract component type and generate instructions
        const componentType = extractComponentType(componentId);
        const spec = getComponentSpec(componentType);
        const instructions = generateInstallationInstructions(componentType);
        
        return {
          componentId,
          componentType,
          available: true,
          instructions,
          estimatedTime: spec.estimatedInstallTime,
          difficultyLevel: spec.complexityLevel,
          requiredPersonnel: spec.personnelRequired,
          weight: spec.weight,
          requiresSpecialTools: spec.requiresSpecialTools,
          videoTutorial: includeVideo ? `https://training.factory.com/install/${componentType}` : null,
          safetyWarning: "Always follow lockout/tagout procedures before maintenance"
        };
      }
    },
    
    getMaintenanceSchedule: {
      description: 'Get recommended maintenance schedule after installation',
      parameters: {
        type: 'object',
        properties: {
          componentId: { type: 'string', description: 'Component ID' }
        },
        required: ['componentId']
      },
      execute: async ({ componentId }) => {
        // Extract component type and generate maintenance schedule
        const componentType = extractComponentType(componentId);
        const schedule = generateMaintenanceSchedule(componentType);
        
        return {
          componentId,
          componentType,
          available: true,
          maintenanceSchedule: schedule.maintenanceSchedule,
          nextMaintenance: schedule.nextMaintenance,
          recordKeeping: schedule.recordKeeping,
          criticalityLevel: schedule.criticalityLevel,
          estimatedAnnualCost: schedule.estimatedAnnualCost
        };
      }
    }
  }
});
