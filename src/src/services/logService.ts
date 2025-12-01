interface DashboardLogPayload {
  action:
    | "ViewActiveProjects"
    | "OpenProject"
    | "OpenReview"
    | "SignDigital"
    | "ChangeFilters";
  projectId?: string;
  userId: string;
  metadata?: any;
}

export function logDashboardAction(payload: DashboardLogPayload) {
  // This stub can be replaced with a real telemetry/audit sink
  console.info("[audit]", payload);
}
