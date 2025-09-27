import { inventoryManagementGraph } from './graphs/inventory-management-simple.ts';
import { project } from '@inkeep/agents-sdk';

export const myProject = project({
  id: 'factory-inventory-management',
  name: 'Factory Inventory Management System',
  description: 'Multi-agent system for managing factory component replacements',
  graphs: () => [inventoryManagementGraph],
});