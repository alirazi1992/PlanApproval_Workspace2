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
    id: "UTN-2045",
    code: "UTN-2045",
    title: "بازطراحی بدنه",
    clientName: "کارفرمای واحد جنوب",
    location: "استان اصفهان",
    responsible: "مهندس رضایی",
    unitName: "واحد طراحی بدنه",
    progressPercent: 66,
    documentsProgressPercent: 75,
    evaluationStatus: "InProgress",
    hasDigitalSignature: false,
    status: "TrackFast",
    dueDate: "2025-07-25",
    lastUpdate: "2025-12-01",
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
  {
    id: "desk-2210",
    code: "UTN-2210",
    title: "نوسازی خط لوله",
    clientName: "شرکت خطوط برتر",
    location: "اهواز",
    responsible: "آیدا محمدی",
    unitName: "واحد پروژه‌های میدانی",
    progressPercent: 35,
    documentsProgressPercent: 42,
    evaluationStatus: "InProgress",
    hasDigitalSignature: false,
    status: "TrackFast",
    dueDate: "2024-08-18",
    lastUpdate: "2024-07-08",
  },
  {
    id: "desk-2140",
    code: "UTN-2140",
    title: "بهینه‌سازی مصرف انرژی",
    clientName: "نیروگاه ارس",
    location: "ارومیه",
    responsible: "سعید نادری",
    unitName: "واحد انرژی و ایمنی",
    progressPercent: 91,
    documentsProgressPercent: 94,
    evaluationStatus: "WaitingClient",
    hasDigitalSignature: true,
    status: "Normal",
    dueDate: "2024-07-20",
    lastUpdate: "2024-07-12",
  },
  {
    id: "desk-2305",
    code: "UTN-2305",
    title: "یکپارچه‌سازی اسناد فنی",
    clientName: "پتروشیمی خلیج فارس",
    location: "بندرعباس",
    responsible: "مهندس کرمی",
    unitName: "مرکز ارزیابی",
    progressPercent: 48,
    documentsProgressPercent: 55,
    evaluationStatus: "NotStarted",
    hasDigitalSignature: false,
    status: "Normal",
    dueDate: "2024-09-02",
    lastUpdate: "2024-07-09",
  },
  {
    id: "desk-2401",
    code: "UTN-2401",
    title: "پایش کیفی خطوط انتقال",
    clientName: "گروه پایش پارس",
    location: "کرمان",
    responsible: "مهندس توکلی",
    unitName: "واحد پروژه‌های میدانی",
    progressPercent: 28,
    documentsProgressPercent: 35,
    evaluationStatus: "InProgress",
    hasDigitalSignature: false,
    status: "TrackFast",
    dueDate: "2024-10-05",
    lastUpdate: "2024-07-14",
  },
  {
    id: "desk-2410",
    code: "UTN-2410",
    title: "بهسازی سازه های نگهدارنده",
    clientName: "پتروگستران",
    location: "تهران",
    responsible: "زهرا رفیعی",
    unitName: "واحد طراحی بدنه",
    progressPercent: 73,
    documentsProgressPercent: 80,
    evaluationStatus: "WaitingClient",
    hasDigitalSignature: true,
    status: "Normal",
    dueDate: "2024-09-15",
    lastUpdate: "2024-07-15",
  },
  {
    id: "desk-2422",
    code: "UTN-2422",
    title: "کالیبراسیون تجهیزات ایمنی",
    clientName: "نیرو اطمینان",
    location: "مشهد",
    responsible: "کاوه غلامی",
    unitName: "واحد انرژی و ایمنی",
    progressPercent: 59,
    documentsProgressPercent: 63,
    evaluationStatus: "InProgress",
    hasDigitalSignature: false,
    status: "Normal",
    dueDate: "2024-08-28",
    lastUpdate: "2024-07-13",
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

  if (scope?.unit) {
    scoped = scoped.filter((p) => p.unitName === scope.unit);
  }

  if (scope?.clientId || scope?.clientName) {
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
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 700);
  });
}
