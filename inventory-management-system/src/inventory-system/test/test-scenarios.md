# Test Scenarios for Factory Inventory Management System

## Test Scenario 1: Basic Component Replacement

### User Input:
"The motor MOTOR-X500 on production line 3 has failed. I need a replacement."

### Expected System Response:
1. **Orchestrator Agent** acknowledges the issue
2. **Supplier Quote Agent** contacts all three suppliers:
   - TechParts Pro: $450, 2 days delivery
   - Industrial Supply Co: $480, 1 day delivery
   - FastTrack Components: $465, 1 day delivery
3. System recommends best option based on price/delivery balance
4. Upon approval, **Order Processing Agent** generates PO
5. **Installation Expert** provides installation instructions

## Test Scenario 2: Urgent Request

### User Input:
"URGENT! The bearing BEARING-Z200 failed and the production line is stopped!"

### Expected System Response:
1. System recognizes urgency
2. **Supplier Quote Agent** prioritizes delivery speed:
   - TechParts Pro: $75, 1 day delivery (BEST FOR URGENT)
   - Industrial Supply Co: $70, 3 days delivery
   - FastTrack Components: $72, 2 days delivery
3. Recommends fastest delivery option despite higher cost
4. Expedited order processing

## Test Scenario 3: Installation Help Request

### User Input:
"I have the new PUMP-H300. Can you provide installation instructions?"

### Expected System Response:
1. **Installation Expert** provides:
   - Safety procedures (isolate system, drain)
   - Step-by-step instructions
   - Required tools (support equipment, torque wrench)
   - Estimated time: 30-45 minutes
   - Maintenance schedule after installation

## Test Scenario 4: Price Comparison

### User Input:
"I need to compare prices for VALVE-V100 from all suppliers."

### Expected System Response:
1. **Supplier Quote Agent** provides comprehensive comparison:
   - TechParts Pro: $120, 2 days
   - Industrial Supply Co: $115, 1 day (BEST VALUE)
   - FastTrack Components: $125, 3 days
2. Analysis of best value vs. fastest delivery

## Test Scenario 5: Complete Workflow

### User Input:
"The temperature sensor SENSOR-S800 in Tank 5 is giving erratic readings. Need replacement."

### Expected System Response:
1. **Orchestrator** confirms sensor issue
2. **Supplier Agent** gets quotes:
   - TechParts Pro: $85, 1 day
   - Industrial Supply Co: $90, 2 days
   - FastTrack Components: $82, 1 day (BEST OVERALL)
3. User approves FastTrack Components
4. **Order Processing**:
   - PO generated: PO-[timestamp]
   - Total: $82
   - No manager approval needed (under $500)
5. **Installation Expert**:
   - Wiring diagram provided
   - Calibration instructions
   - Safety: Power down control system
   - Maintenance: Monthly calibration check

## Test Commands for CLI

```bash
# Test with the Inkeep chat interface
cd src/inventory-system
inkeep chat

# Sample messages to test:
"I need to report a broken MOTOR-X500"
"Get me quotes for BEARING-Z200"
"This is urgent - production line is down"
"Yes, proceed with the order"
"I need installation instructions for PUMP-H300"
```

## Validation Checklist

- [ ] Orchestrator properly delegates to specialized agents
- [ ] Supplier agent contacts all three suppliers
- [ ] Pricing and delivery information is accurate
- [ ] Order processing generates proper documentation
- [ ] Installation instructions include safety warnings
- [ ] Urgency affects recommendation priority
- [ ] System maintains conversation context
- [ ] All agents respond appropriately to their delegated tasks
