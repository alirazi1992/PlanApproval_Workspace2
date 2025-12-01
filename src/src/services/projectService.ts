import { ActiveProject } from "../types/projects";

export interface ProjectFilters {
  status?: "All" | "Normal" | "TrackFast";
  search?: string;
  unitId?: string;
  fromDate?: string;
  toDate?: string;
  sort?: "DueDate" | "TrackFast" | "Delay" | "Alphabetical";
}

const mockProjects: ActiveProject[] = [
  {
    id: "desk-2045",
    code: "UTN-2045",
    title: "بازطراحی بدنه ",
    clientName: "خط لوله جنوب",
    location: "اصفهان",
    responsible: "سارا رحیمی",
    unitName: "واحد طراحی",
    progressPercent: 68,
    documentsProgressPercent: 75,
    evaluationStatus: "InProgress",
    hasDigitalSignature: false,
    status: "TrackFast",
    dueDate: "2024-07-25",
    lastUpdate: "2024-07-12",
  },
  {
    id: "desk-2101",
    code: "UTN-2101",
    title: "طراحی سیستم تهویه",
    clientName: "هواپویان",
    location: "شیراز",
    responsible: "محمد رضوی",
    unitName: "واحد تاسیسات",
    progressPercent: 82,
    documentsProgressPercent: 90,
    evaluationStatus: "WaitingClient",
    hasDigitalSignature: true,
    status: "Normal",
    dueDate: "2024-08-05",
    lastUpdate: "2024-07-10",
  },
  {
    id: "desk-1980",
    code: "UTN-1980",
    title: "مهندسی قطعات داخلی",
    clientName: "شمال انرژی",
    location: "تبریز",
    responsible: "الهام داوودی",
    unitName: "مرکز ارزیابی",
    progressPercent: 54,
    documentsProgressPercent: 60,
    evaluationStatus: "NotStarted",
    hasDigitalSignature: false,
    status: "Normal",
    dueDate: "2024-07-30",
    lastUpdate: "2024-07-11",
  },
];

function applyFilters(projects: ActiveProject[], filters: ProjectFilters) {
  let filtered = [...projects];

  if (filters.status && filters.status !== "All") {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.code.toLowerCase().includes(term) ||
        p.title.toLowerCase().includes(term) ||
        p.clientName.toLowerCase().includes(term)
    );
  }

  if (filters.unitId) {
    filtered = filtered.filter((p) => p.unitName === filters.unitId);
  }

  if (filters.fromDate) {
    filtered = filtered.filter((p) => !p.dueDate || p.dueDate >= filters.fromDate!);
  }

  if (filters.toDate) {
    filtered = filtered.filter((p) => !p.dueDate || p.dueDate <= filters.toDate!);
  }

  switch (filters.sort) {
    case "DueDate":
      filtered.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
      break;
    case "TrackFast":
      filtered.sort((a, b) => {
        const aScore = a.status === "TrackFast" ? 0 : 1;
        const bScore = b.status === "TrackFast" ? 0 : 1;
        return aScore - bScore;
      });
      break;
    case "Delay":
      filtered.sort((a, b) => a.progressPercent - b.progressPercent);
      break;
    case "Alphabetical":
      filtered.sort((a, b) => a.code.localeCompare(b.code, "fa"));
      break;
    default:
      break;
  }

  return filtered;
}

export async function getActiveProjects(
  scope: any,
  filters: ProjectFilters
): Promise<ActiveProject[]> {
  console.debug("Fetching active projects with scope", scope, "and filters", filters);
  await new Promise((resolve) => setTimeout(resolve, 300));
  let scoped = [...mockProjects];

  if (scope?.scope === "unit" && scope.unitId) {
    scoped = scoped.filter((p) => p.unitName === scope.unitId);
  }

  if (scope?.scope === "client" && scope.clientEmail) {
    scoped = scoped.filter((p) =>
      scope.clientName ? p.clientName === scope.clientName : Boolean(p.clientName)
    );
  }

  return applyFilters(scoped, filters);
}

export async function getProjectById(id: string): Promise<ActiveProject> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const project = mockProjects.find((p) => p.id === id || p.code === id);
  if (!project) throw new Error("Project not found");
  return project;
}

export async function signProjectDocuments(projectId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const idx = mockProjects.findIndex((p) => p.id === projectId);
  if (idx >= 0) {
    mockProjects[idx] = { ...mockProjects[idx], hasDigitalSignature: true };
  }
}
