import {
  Settings,
  UserPlus,
  Users,
  Clock,
  DollarSign,
  Calculator,
  BarChart2,
  Package,
  LineChart,
  MessageSquare,
  Bell,
  FileText
} from 'lucide-react';

export const ALL_FEATURES = [
  {
    key: "Setup",
    label: "Setup",
    icon: Settings,
    items: [
      { path: "/dashboard/setup/create-office", label: "Create Office" },
      { path: "/dashboard/setup/create-user", label: "Create User" },
      { path: "/dashboard/setup/add-guards-category", label: "Add Guards Category" }
    ]
  },
  {
    key: "Registration",
    label: "Registration",
    icon: UserPlus,
    items: [
      { path: "/dashboard/registration/guard-registration", label: "Guard Registration" },
      { path: "/dashboard/registration/employee-registration", label: "Employee Registration" }
    ]
  },
  {
    key: "Deployment",
    label: "Deployment",
    icon: Users,
    items: [
      { path: "/dashboard/deployment/all-guards", label: "All Guards" },
      { path: "/dashboard/deployment/deploy-guards", label: "Deploy Guards" }
    ]
  },
  {
    key: "Attendance",
    label: "Attendance",
    icon: Clock,
    items: [
      { path: "/dashboard/attendance/mark-attendance", label: "Mark Attendance" },
      { path: "/dashboard/attendance/attendance-report", label: "Attendance Report" }
    ]
  },
  {
    key: "Payroll",
    label: "Payroll",
    icon: DollarSign,
    items: [
      { path: "/dashboard/payroll/process-payroll", label: "Process Payroll" },
      { path: "/dashboard/payroll/salary-reports", label: "Salary Reports" }
    ]
  },
  {
    key: "Accounts & Finance",
    label: "Accounts & Finance",
    icon: Calculator,
    items: [
      { path: "/dashboard/accounts/invoices", label: "Invoices" },
      { path: "/dashboard/accounts/expenses", label: "Expenses" }
    ]
  },
  {
    key: "Performance Manager",
    label: "Performance Manager",
    icon: BarChart2,
    items: [
      { path: "/dashboard/performance-manager/initiate-event", label: "Initiate Event" },
      { path: "/dashboard/performance-manager/profile-rating", label: "Profile Rating" }
    ]
  },
  {
    key: "Inventory Management",
    label: "Inventory Management",
    icon: Package,
    items: [
      { path: "/dashboard/inventory-management/equipment", label: "Equipment" },
      { path: "/dashboard/inventory-management/vendors", label: "Vendors" },
      { path: "/dashboard/inventory-management/create-po", label: "Create PO" }
    ]
  },
  {
    key: "Sales Monitor",
    label: "Sales Monitor",
    icon: LineChart,
    items: [
      { path: "/dashboard/sales/leads", label: "Leads" },
      { path: "/dashboard/sales/opportunities", label: "Opportunities" }
    ]
  },
  {
    key: "Complaints",
    label: "Complaints",
    icon: MessageSquare,
    items: [
      { path: "/dashboard/complaints/register", label: "Register Complaint" },
      { path: "/dashboard/complaints/view", label: "View Complaints" }
    ]
  },
  {
    key: "Notifications/Announcements",
    label: "Notifications",
    icon: Bell,
    items: [
      { path: "/dashboard/notifications/send", label: "Send Notification" },
      { path: "/dashboard/notifications/view", label: "View Notifications" }
    ]
  },
  {
    key: "Reports",
    label: "Reports",
    icon: FileText,
    items: [
      { path: "/dashboard/reports/operational", label: "Operational Reports" },
      { path: "/dashboard/reports/financial", label: "Financial Reports" }
    ]
  }
];