import { OrganizationFeatures } from '@/constants/features';

// Map of feature names to their corresponding menu sections
export const FEATURE_MENU_MAP = {
  [OrganizationFeatures.SETUP]: 'setup',
  [OrganizationFeatures.REGISTRATION]: 'registration',
  [OrganizationFeatures.DEPLOYMENT]: 'deployment',
  [OrganizationFeatures.ATTENDANCE]: 'attendance',
  [OrganizationFeatures.PAYROLL]: 'payroll',
  [OrganizationFeatures.ACCOUNTS_FINANCE]: 'accounts',
  [OrganizationFeatures.PERFORMANCE_MANAGER]: 'performanceManager',
  [OrganizationFeatures.INVENTORY_MANAGEMENT]: 'inventoryManagement',
  [OrganizationFeatures.SALES_MONITOR]: 'salesMonitor',
  [OrganizationFeatures.COMPLAINTS]: 'complaints',
  [OrganizationFeatures.NOTIFICATIONS]: 'notifications',
  [OrganizationFeatures.REPORTS]: 'reports'
};