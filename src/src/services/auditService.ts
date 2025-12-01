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
  console.log("Audit:", payload.action, payload.projectId, payload.userId, payload.metadata);
}
