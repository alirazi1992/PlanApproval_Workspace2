export type ProjectStatus = "Normal" | "TrackFast";

export interface ActiveProject {
  id: string;
  code: string; // e.g. "UTN-1980"
  title: string; // e.g. "مهندسی قطعات داخلی"
  clientName: string;
  location: string;
  responsible: string; // مسئول/کارشناس مسئول
  unitName: string; // واحد/دپارتمان
  progressPercent: number; // overall project progress
  documentsProgressPercent: number; // document review completion
  evaluationStatus: "NotStarted" | "InProgress" | "WaitingClient" | "Completed";
  hasDigitalSignature: boolean;
  status: ProjectStatus; // Normal or Track-Fast
  dueDate?: string;
  lastUpdate?: string;
}
