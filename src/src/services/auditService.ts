export type DashboardAction =
  | "ViewActiveProjects"
  | "OpenProject"
  | "OpenReview"
  | "SignDigital"
  | "ChangeFilters";

export function logDashboardAction(payload: {
  action: DashboardAction;
  projectId?: string;
  userId: string;
  metadata?: any;
}) {
  // placeholder for backend audit logging
  console.info("[audit]", payload);
}
