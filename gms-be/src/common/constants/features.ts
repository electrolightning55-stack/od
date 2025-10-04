// Features that can be assigned to organizations
export enum OrganizationFeatures {
  SETUP = 'Setup',
  REGISTRATION = 'Registration',
  DEPLOYMENT = 'Deployment',
  ATTENDANCE = 'Attendance',
  PAYROLL = 'Payroll',
  ACCOUNTS_FINANCE = 'Accounts & Finance',
  PERFORMANCE_MANAGER = 'Performance Manager',
  INVENTORY_MANAGEMENT = 'Inventory Management',
  SALES_MONITOR = 'Sales Monitor',
  COMPLAINTS = 'Complaints',
  NOTIFICATIONS = 'Notifications/Announcements',
  REPORTS = 'Reports'
}

export const ALL_FEATURES = Object.values(OrganizationFeatures);