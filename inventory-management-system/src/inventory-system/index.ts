import { project } from '@inkeep/agents-sdk';
import { inventoryManagementGraph } from './graphs/inventory-management';

export const inventoryProject = project({
  id: 'inventory-system',
  name: 'Factory Inventory Management System',
  description: 'Multi-agent system for managing factory component replacements',
  graphs: () => [inventoryManagementGraph],
});
