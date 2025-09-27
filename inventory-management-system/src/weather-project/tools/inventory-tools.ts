import { mcpTool } from '@inkeep/agents-sdk';

// For demo purposes, we'll use mock MCP servers
// In production, these would be actual MCP server endpoints

// Mock Supplier Database
const suppliers = {
  supplier1: {
    name: "TechParts Pro",
    catalog: {
      "MOTOR-X500": { price: 450, delivery: 2 },
      "BEARING-Z200": { price: 75, delivery: 1 },
      "PUMP-H300": { price: 320, delivery: 3 },
      "VALVE-V100": { price: 120, delivery: 2 },
      "SENSOR-S800": { price: 85, delivery: 1 }
    }
  },
  supplier2: {
    name: "Industrial Supply Co",
    catalog: {
      "MOTOR-X500": { price: 480, delivery: 1 },
      "BEARING-Z200": { price: 70, delivery: 3 },
      "PUMP-H300": { price: 310, delivery: 2 },
      "VALVE-V100": { price: 115, delivery: 1 },
      "SENSOR-S800": { price: 90, delivery: 2 }
    }
  },
  supplier3: {
    name: "FastTrack Components",
    catalog: {
      "MOTOR-X500": { price: 465, delivery: 1 },
      "BEARING-Z200": { price: 72, delivery: 2 },
      "PUMP-H300": { price: 335, delivery: 1 },
      "VALVE-V100": { price: 125, delivery: 3 },
      "SENSOR-S800": { price: 82, delivery: 1 }
    }
  }
};

// Installation instructions database
const installationInstructions = {
  "MOTOR-X500": `
Installation Instructions for MOTOR-X500:
1. Power off the machine and lock out/tag out
2. Disconnect electrical connections from old motor
3. Remove mounting bolts (4x 12mm hex bolts)
4. Carefully lift out old motor (weight: 25kg)
5. Clean mounting surface thoroughly
6. Position new motor on mounting brackets
7. Install and torque mounting bolts to 45 Nm
8. Reconnect electrical connections (follow color coding)
9. Check alignment with coupling gauge
10. Test run at low speed for 5 minutes
Safety: Ensure proper grounding. Two-person lift required.
`,
  "BEARING-Z200": `
Installation Instructions for BEARING-Z200:
1. Shut down machine and allow to cool
2. Remove bearing housing cover
3. Extract old bearing using bearing puller
4. Clean bearing housing with solvent
5. Apply thin layer of assembly grease
6. Heat new bearing to 80°C in bearing heater
7. Install bearing using installation sleeve
8. Check for proper seating and rotation
9. Apply specified lubricant (2.5g)
10. Replace housing cover
Tools needed: Bearing puller, bearing heater, torque wrench
`,
  "PUMP-H300": `
Installation Instructions for PUMP-H300:
1. Isolate and drain system
2. Close inlet and outlet valves
3. Disconnect piping (mark connections)
4. Remove old pump (support weight)
5. Clean mounting surface and check gaskets
6. Position new pump with new gaskets
7. Align and connect piping
8. Torque flange bolts in cross pattern
9. Prime pump as per manufacturer specs
10. Open valves slowly and check for leaks
Note: Check rotation direction before startup
`,
  "VALVE-V100": `
Installation Instructions for VALVE-V100:
1. Depressurize system completely
2. Close upstream and downstream valves
3. Drain line section
4. Remove old valve (note flow direction)
5. Clean pipe threads or flanges
6. Apply thread sealant or install gaskets
7. Install new valve (check flow arrow)
8. Tighten connections to specification
9. Slowly pressurize and check for leaks
10. Test valve operation through full range
Critical: Ensure valve orientation matches flow direction
`,
  "SENSOR-S800": `
Installation Instructions for SENSOR-S800:
1. Power down control system
2. Locate sensor mounting point
3. Remove old sensor (note wire colors)
4. Clean mounting surface
5. Apply thermal paste if temperature sensor
6. Mount new sensor (do not overtighten)
7. Connect wires according to diagram
8. Verify wiring with multimeter
9. Power up and check signal reading
10. Calibrate if necessary
Wiring: Red(+24V), Black(GND), Blue(Signal)
`
};

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
        const supplier = suppliers[supplierId];
        if (!supplier) {
          return { error: `Supplier ${supplierId} not found` };
        }
        
        const component = supplier.catalog[componentId];
        if (!component) {
          return { 
            supplier: supplier.name,
            componentId,
            available: false,
            message: "Component not available from this supplier"
          };
        }
        
        return {
          supplier: supplier.name,
          componentId,
          available: true,
          price: component.price,
          deliveryDays: component.delivery,
          currency: "USD"
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
        const quotes = [];
        
        for (const [supplierId, supplier] of Object.entries(suppliers)) {
          const component = supplier.catalog[componentId];
          if (component) {
            quotes.push({
              supplierId,
              supplierName: supplier.name,
              price: component.price,
              deliveryDays: component.delivery,
              currency: "USD"
            });
          }
        }
        
        if (quotes.length === 0) {
          return {
            componentId,
            message: "Component not available from any supplier",
            quotes: []
          };
        }
        
        // Sort by best combination of price and delivery
        quotes.sort((a, b) => {
          const scoreA = a.price + (a.deliveryDays * 50); // Penalty for delivery days
          const scoreB = b.price + (b.deliveryDays * 50);
          return scoreA - scoreB;
        });
        
        return {
          componentId,
          quotes,
          bestOption: quotes[0],
          totalSuppliers: quotes.length
        };
      }
    }
  }
});

// MCP server for order processing
export const orderMcpTool = mcp({
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
        const supplier = suppliers[supplierId];
        if (!supplier || !supplier.catalog[componentId]) {
          return { error: 'Invalid supplier or component' };
        }
        
        const component = supplier.catalog[componentId];
        const orderNumber = `PO-${Date.now()}`;
        const totalPrice = component.price * quantity;
        
        return {
          purchaseOrder: {
            orderNumber,
            date: new Date().toISOString(),
            supplier: supplier.name,
            componentId,
            quantity,
            unitPrice: component.price,
            totalPrice,
            currency: "USD",
            deliveryDays: component.delivery,
            urgency,
            status: "GENERATED",
            paymentTerms: "Net 30",
            shippingAddress: "Factory Floor, Building A, Industrial Park",
            approvalRequired: totalPrice > 500
          },
          message: `Purchase order ${orderNumber} generated successfully`
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
export const installationMcpTool = mcp({
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
        const instructions = installationInstructions[componentId];
        
        if (!instructions) {
          return {
            componentId,
            available: false,
            message: "Installation instructions not found for this component"
          };
        }
        
        return {
          componentId,
          available: true,
          instructions,
          estimatedTime: "30-45 minutes",
          difficultyLevel: "Intermediate",
          requiredPersonnel: 1,
          videoTutorial: includeVideo ? `https://training.factory.com/install/${componentId}` : null,
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
        const schedules = {
          "MOTOR-X500": {
            daily: "Check for unusual noise or vibration",
            weekly: "Verify temperature readings",
            monthly: "Lubricate bearings, check alignment",
            annually: "Full inspection and bearing replacement"
          },
          "BEARING-Z200": {
            daily: "Monitor temperature",
            weekly: "Check lubrication levels",
            monthly: "Vibration analysis",
            annually: "Replace if wear detected"
          },
          "PUMP-H300": {
            daily: "Check for leaks, monitor pressure",
            weekly: "Verify flow rate",
            monthly: "Clean filters, check seals",
            annually: "Overhaul and seal replacement"
          },
          "VALVE-V100": {
            daily: "Visual inspection",
            weekly: "Cycle test",
            monthly: "Lubricate stem",
            annually: "Replace seals and gaskets"
          },
          "SENSOR-S800": {
            daily: "Verify readings",
            weekly: "Clean sensor surface",
            monthly: "Calibration check",
            annually: "Full calibration and replacement if drift detected"
          }
        };
        
        const schedule = schedules[componentId];
        if (!schedule) {
          return {
            componentId,
            available: false,
            message: "Maintenance schedule not available"
          };
        }
        
        return {
          componentId,
          maintenanceSchedule: schedule,
          nextMaintenance: "After installation testing",
          recordKeeping: "Log all maintenance in CMMS system"
        };
      }
    }
  }
});
