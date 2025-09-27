// Dynamic Data Generators for Inventory Management System
// This module provides realistic, dynamic data generation instead of hardcoded mock data

export interface ComponentSpec {
  type: string;
  category: string;
  basePrice: number;
  priceVariation: number; // percentage variation (0.0 to 1.0)
  baseDays: number;
  complexityLevel: 'simple' | 'intermediate' | 'complex';
  weight: number; // in kg
  requiresSpecialTools: boolean;
  personnelRequired: number;
  estimatedInstallTime: string;
}

export interface SupplierProfile {
  name: string;
  reliability: number; // 0.0 to 1.0
  priceCompetitiveness: number; // 0.0 to 1.0 (higher = more competitive)
  deliverySpeed: number; // 0.0 to 1.0 (higher = faster)
  specialties: string[];
}

// Component specifications database
const componentSpecs: Record<string, ComponentSpec> = {
  'motor': {
    type: 'motor',
    category: 'electrical',
    basePrice: 1200,
    priceVariation: 0.4,
    baseDays: 3,
    complexityLevel: 'complex',
    weight: 25,
    requiresSpecialTools: true,
    personnelRequired: 2,
    estimatedInstallTime: '1-2 hours'
  },
  'pump': {
    type: 'pump',
    category: 'hydraulic',
    basePrice: 800,
    priceVariation: 0.3,
    baseDays: 2,
    complexityLevel: 'intermediate',
    weight: 15,
    requiresSpecialTools: true,
    personnelRequired: 2,
    estimatedInstallTime: '45-90 minutes'
  },
  'bearing': {
    type: 'bearing',
    category: 'mechanical',
    basePrice: 120,
    priceVariation: 0.25,
    baseDays: 1,
    complexityLevel: 'intermediate',
    weight: 2,
    requiresSpecialTools: true,
    personnelRequired: 1,
    estimatedInstallTime: '30-45 minutes'
  },
  'valve': {
    type: 'valve',
    category: 'hydraulic',
    basePrice: 450,
    priceVariation: 0.35,
    baseDays: 2,
    complexityLevel: 'intermediate',
    weight: 8,
    requiresSpecialTools: false,
    personnelRequired: 1,
    estimatedInstallTime: '30-60 minutes'
  },
  'sensor': {
    type: 'sensor',
    category: 'electrical',
    basePrice: 250,
    priceVariation: 0.3,
    baseDays: 1,
    complexityLevel: 'simple',
    weight: 0.5,
    requiresSpecialTools: false,
    personnelRequired: 1,
    estimatedInstallTime: '15-30 minutes'
  },
  'conveyor': {
    type: 'conveyor',
    category: 'mechanical',
    basePrice: 2500,
    priceVariation: 0.5,
    baseDays: 5,
    complexityLevel: 'complex',
    weight: 150,
    requiresSpecialTools: true,
    personnelRequired: 3,
    estimatedInstallTime: '2-4 hours'
  },
  'actuator': {
    type: 'actuator',
    category: 'pneumatic',
    basePrice: 350,
    priceVariation: 0.3,
    baseDays: 2,
    complexityLevel: 'intermediate',
    weight: 5,
    requiresSpecialTools: false,
    personnelRequired: 1,
    estimatedInstallTime: '30-45 minutes'
  },
  'drive': {
    type: 'drive',
    category: 'electrical',
    basePrice: 1800,
    priceVariation: 0.4,
    baseDays: 3,
    complexityLevel: 'complex',
    weight: 12,
    requiresSpecialTools: true,
    personnelRequired: 2,
    estimatedInstallTime: '1-3 hours'
  }
};

// Dynamic supplier profiles
const supplierProfiles: SupplierProfile[] = [
  {
    name: "TechParts Pro",
    reliability: 0.9,
    priceCompetitiveness: 0.7,
    deliverySpeed: 0.8,
    specialties: ['electrical', 'sensors', 'drives']
  },
  {
    name: "Industrial Supply Co",
    reliability: 0.85,
    priceCompetitiveness: 0.8,
    deliverySpeed: 0.6,
    specialties: ['mechanical', 'hydraulic', 'general']
  },
  {
    name: "FastTrack Components",
    reliability: 0.8,
    priceCompetitiveness: 0.6,
    deliverySpeed: 0.9,
    specialties: ['urgent', 'express', 'all-categories']
  },
  {
    name: "Precision Parts Ltd",
    reliability: 0.95,
    priceCompetitiveness: 0.5,
    deliverySpeed: 0.7,
    specialties: ['precision', 'bearings', 'mechanical']
  },
  {
    name: "Budget Components Inc",
    reliability: 0.7,
    priceCompetitiveness: 0.9,
    deliverySpeed: 0.5,
    specialties: ['budget', 'bulk', 'standard']
  }
];

// Generate component ID based on type and specifications
export function generateComponentId(componentType: string): string {
  const spec = getComponentSpec(componentType);
  const typeCode = componentType.toUpperCase().substring(0, 3);
  const categoryCode = spec.category.toUpperCase().substring(0, 1);
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `${typeCode}-${categoryCode}${randomNum}`;
}

// Get component specifications
export function getComponentSpec(componentType: string): ComponentSpec {
  const normalizedType = componentType.toLowerCase();
  
  // Find exact match first
  if (componentSpecs[normalizedType]) {
    return componentSpecs[normalizedType];
  }
  
  // Find partial match
  for (const [key, spec] of Object.entries(componentSpecs)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return spec;
    }
  }
  
  // Default fallback
  return {
    type: 'generic',
    category: 'general',
    basePrice: 300,
    priceVariation: 0.3,
    baseDays: 2,
    complexityLevel: 'intermediate',
    weight: 5,
    requiresSpecialTools: false,
    personnelRequired: 1,
    estimatedInstallTime: '30-60 minutes'
  };
}

// Generate realistic supplier quotes
export function generateSupplierQuotes(componentType: string, urgency: 'normal' | 'urgent' | 'critical' = 'normal') {
  const spec = getComponentSpec(componentType);
  const quotes: any[] = [];
  
  // Select 3-4 random suppliers
  const selectedSuppliers = supplierProfiles
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 3); // 3-4 suppliers
  
  for (const supplier of selectedSuppliers) {
    // Calculate price based on supplier competitiveness and component specs
    const baseVariation = (Math.random() - 0.5) * spec.priceVariation;
    const competitivenessAdjustment = (1 - supplier.priceCompetitiveness) * 0.2;
    const urgencyMultiplier = urgency === 'critical' ? 1.3 : urgency === 'urgent' ? 1.15 : 1.0;
    
    const price = Math.round(spec.basePrice * (1 + baseVariation + competitivenessAdjustment) * urgencyMultiplier);
    
    // Calculate delivery time
    const speedAdjustment = supplier.deliverySpeed * 0.5; // Up to 50% faster
    const urgencyAdjustment = urgency === 'critical' ? 0.5 : urgency === 'urgent' ? 0.7 : 1.0;
    const deliveryDays = Math.max(1, Math.round(spec.baseDays * urgencyAdjustment * (1 - speedAdjustment)));
    
    // Check if supplier specializes in this category
    const hasSpecialty = supplier.specialties.includes(spec.category) || 
                        supplier.specialties.includes(spec.type) ||
                        supplier.specialties.includes('all-categories');
    
    // Availability based on reliability and specialty
    const availability = Math.random() < (supplier.reliability * (hasSpecialty ? 1.1 : 0.9));
    
    if (availability) {
      quotes.push({
        supplier: supplier.name,
        supplierId: supplier.name.toLowerCase().replace(/\s+/g, '-'),
        price,
        deliveryDays,
        currency: 'USD',
        hasRushOption: supplier.deliverySpeed > 0.7,
        reliability: supplier.reliability,
        specialty: hasSpecialty,
        estimatedShipping: deliveryDays === 1 ? 'Express' : deliveryDays <= 2 ? 'Fast' : 'Standard'
      });
    }
  }
  
  // Sort by best value (price + delivery penalty)
  quotes.sort((a, b) => {
    const scoreA = a.price + (a.deliveryDays * 50);
    const scoreB = b.price + (b.deliveryDays * 50);
    return scoreA - scoreB;
  });
  
  return quotes;
}

// Generate installation instructions dynamically
export function generateInstallationInstructions(componentType: string): string {
  const spec = getComponentSpec(componentType);
  const instructions: string[] = [];
  
  // Safety first
  instructions.push("⚠️ SAFETY FIRST:");
  instructions.push("1. Power off the machine and implement lockout/tagout procedures");
  instructions.push("2. Allow equipment to cool down if recently operated");
  
  // Component-specific preparation
  if (spec.category === 'electrical') {
    instructions.push("3. Verify electrical isolation with multimeter");
    instructions.push("4. Disconnect all electrical connections (label wires)");
  } else if (spec.category === 'hydraulic') {
    instructions.push("3. Depressurize system completely");
    instructions.push("4. Drain fluid from component area");
  } else if (spec.category === 'pneumatic') {
    instructions.push("3. Release air pressure from system");
    instructions.push("4. Disconnect air lines (mark connections)");
  }
  
  // Removal steps
  instructions.push("5. Remove mounting hardware");
  if (spec.weight > 10) {
    instructions.push(`6. Use lifting equipment for heavy component (${spec.weight}kg)`);
  }
  instructions.push("7. Carefully remove old component");
  instructions.push("8. Clean mounting surface thoroughly");
  
  // Installation steps
  instructions.push("9. Inspect new component for damage");
  instructions.push("10. Position new component (check alignment)");
  instructions.push("11. Install mounting hardware to specification");
  
  if (spec.requiresSpecialTools) {
    instructions.push("12. Use calibrated torque wrench for critical fasteners");
  }
  
  // Reconnection
  if (spec.category === 'electrical') {
    instructions.push("13. Reconnect electrical connections per wiring diagram");
    instructions.push("14. Verify proper grounding");
  } else if (spec.category === 'hydraulic') {
    instructions.push("13. Reconnect fluid lines with new seals/gaskets");
    instructions.push("14. Refill system and check for leaks");
  }
  
  // Testing
  instructions.push("15. Perform initial function test");
  instructions.push("16. Monitor operation for first 10 minutes");
  instructions.push("17. Document installation in maintenance log");
  
  // Add complexity-specific notes
  if (spec.complexityLevel === 'complex') {
    instructions.push("\n🔧 COMPLEX INSTALLATION NOTES:");
    instructions.push("- Requires experienced technician");
    instructions.push("- May need specialized alignment tools");
    instructions.push("- Consider manufacturer training");
  }
  
  return instructions.join('\n');
}

// Generate maintenance schedule dynamically
export function generateMaintenanceSchedule(componentType: string) {
  const spec = getComponentSpec(componentType);
  
  const schedule = {
    daily: "Visual inspection for abnormal conditions",
    weekly: "Check operational parameters",
    monthly: "Detailed inspection and basic maintenance",
    quarterly: "Performance verification",
    annually: "Complete overhaul assessment"
  };
  
  // Customize based on component type
  if (spec.category === 'electrical') {
    schedule.weekly = "Check electrical connections and temperature";
    schedule.monthly = "Verify calibration and clean contacts";
    schedule.quarterly = "Insulation resistance test";
  } else if (spec.category === 'mechanical') {
    schedule.weekly = "Check for wear and lubrication levels";
    schedule.monthly = "Lubricate moving parts, check alignment";
    schedule.quarterly = "Vibration analysis and wear measurement";
  } else if (spec.category === 'hydraulic') {
    schedule.weekly = "Check for leaks and pressure readings";
    schedule.monthly = "Replace filters, check fluid levels";
    schedule.quarterly = "Fluid analysis and seal inspection";
  }
  
  // Adjust frequency based on complexity
  if (spec.complexityLevel === 'complex') {
    schedule.weekly = schedule.weekly + " (critical component - increased monitoring)";
  }
  
  return {
    componentId: generateComponentId(componentType),
    maintenanceSchedule: schedule,
    nextMaintenance: "After installation testing and 24-hour run-in",
    recordKeeping: "Log all maintenance in CMMS system",
    criticalityLevel: spec.complexityLevel,
    estimatedAnnualCost: Math.round(spec.basePrice * 0.15) // 15% of component cost
  };
}

// Generate realistic order details
export function generateOrderDetails(componentType: string, supplierName: string, urgency: 'normal' | 'urgent' | 'critical' = 'normal') {
  const spec = getComponentSpec(componentType);
  const componentId = generateComponentId(componentType);
  const orderNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  // Find supplier info
  const supplier = supplierProfiles.find(s => s.name === supplierName) || supplierProfiles[0];
  
  // Generate quote for this specific supplier
  const basePrice = spec.basePrice * (1 + (Math.random() - 0.5) * spec.priceVariation);
  const urgencyMultiplier = urgency === 'critical' ? 1.3 : urgency === 'urgent' ? 1.15 : 1.0;
  const price = Math.round(basePrice * urgencyMultiplier);
  
  const deliveryDays = Math.max(1, Math.round(spec.baseDays * (urgency === 'critical' ? 0.5 : urgency === 'urgent' ? 0.7 : 1.0)));
  
  return {
    orderNumber,
    componentId,
    componentType: spec.type,
    supplier: supplier.name,
    price,
    deliveryDays,
    urgency,
    approvalRequired: price > 500,
    estimatedDelivery: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString(),
    shippingMethod: deliveryDays === 1 ? 'Express' : deliveryDays <= 2 ? 'Fast' : 'Standard',
    trackingAvailable: true,
    warrantyPeriod: spec.complexityLevel === 'complex' ? '2 years' : '1 year'
  };
}

// Extract component type from user message
export function extractComponentType(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Direct matches
  for (const componentType of Object.keys(componentSpecs)) {
    if (lowerMessage.includes(componentType)) {
      return componentType;
    }
  }
  
  // Synonym matching
  const synonyms = {
    'motor': ['engine', 'drive motor', 'electric motor'],
    'pump': ['hydraulic pump', 'water pump', 'fluid pump'],
    'bearing': ['ball bearing', 'roller bearing', 'thrust bearing'],
    'valve': ['control valve', 'shut-off valve', 'relief valve'],
    'sensor': ['transmitter', 'detector', 'probe', 'gauge'],
    'conveyor': ['belt', 'conveyor belt', 'transport system'],
    'actuator': ['cylinder', 'pneumatic cylinder', 'linear actuator'],
    'drive': ['variable drive', 'frequency drive', 'vfd']
  };
  
  for (const [componentType, syns] of Object.entries(synonyms)) {
    if (syns.some(syn => lowerMessage.includes(syn))) {
      return componentType;
    }
  }
  
  return 'generic';
}

// Generate realistic status updates
export function generateStatusUpdate(): string {
  const statuses = [
    "Order PO-2024-{random} for {component} shipped today, tracking #{tracking}",
    "Component {component} delivered to receiving dock, ready for installation",
    "Urgent order for {component} expedited - arriving {time}",
    "Quality inspection completed for {component} - approved for installation",
    "Supplier {supplier} confirmed stock availability for {component}",
    "Installation scheduled for {component} replacement on {date}",
    "Maintenance window approved for {component} installation - {time}",
    "Emergency order {po} processed - {component} arriving via express delivery"
  ];
  
  const components = Object.keys(componentSpecs);
  const suppliers = supplierProfiles.map(s => s.name);
  
  const template = statuses[Math.floor(Math.random() * statuses.length)];
  
  return template
    .replace('{random}', String(Math.floor(Math.random() * 9000) + 1000))
    .replace('{component}', components[Math.floor(Math.random() * components.length)])
    .replace('{supplier}', suppliers[Math.floor(Math.random() * suppliers.length)])
    .replace('{tracking}', `1Z${Math.random().toString(36).substr(2, 12).toUpperCase()}`)
    .replace('{time}', Math.random() > 0.5 ? 'tomorrow morning' : 'this afternoon')
    .replace('{date}', new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString())
    .replace('{po}', `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
}
