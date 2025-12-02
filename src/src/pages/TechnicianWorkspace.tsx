import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

type WorkspaceProject = {
  id: string;
  utn: string;
  title: string;
  stage: string;
  owner: string;
  region: string;
  status: "در حال بررسی" | "در حال انجام" | "تکمیل شده";
  docsReady: number;
  docsTotal: number;
  docsCount: number;
  inspectionsCount: number;
  certificatesCount: number;
  stampsCount: number;
  capaCount: number;
  review: string;
  approval: string;
  signature: string;
};

const mockProjects: WorkspaceProject[] = [
  {
    id: "desk-2045",
    utn: "UTN-2045",
    title: "بازطراحی بدنه ",
    stage: "ارزیابی فنی",
    owner: "سارا رحیمی",
    region: "اصفهان",
    status: "در حال انجام",
    docsReady: 6,
    docsTotal: 8,
    docsCount: 12,
    inspectionsCount: 3,
    certificatesCount: 1,
    stampsCount: 2,
    capaCount: 1,
    review: "در حال بررسی",
    approval: "در انتظار تایید کیفیت",
    signature: "نیازمند مهر AsiaClass",
  },
  {
    id: "desk-2101",
    utn: "UTN-2101",
    title: "طراحی سیستم تهویه",
    stage: "بازبینی مدارک",
    owner: "محمد رضوی",
    region: "شیراز",
    status: "در حال بررسی",
    docsReady: 4,
    docsTotal: 5,
    docsCount: 9,
    inspectionsCount: 2,
    certificatesCount: 2,
    stampsCount: 3,
    capaCount: 0,
    review: "تکمیل ۸۰٪",
    approval: "مدارک فنی تایید شد",
    signature: "امضای دیجیتال انجام شد",
  },
  {
    id: "desk-1980",
    utn: "UTN-1980",
    title: "مهندسی قطعات داخلی",
    stage: "پیش‌نویس تایید",
    owner: "الهام داوودی",
    region: "تبریز",
    status: "در حال بررسی",
    docsReady: 5,
    docsTotal: 7,
    docsCount: 10,
    inspectionsCount: 4,
    certificatesCount: 0,
    stampsCount: 1,
    capaCount: 2,
    review: "هم‌تراز با AsiaClass",
    approval: "در انتظار ممیزی نهایی",
    signature: "نیازمند امضا و مهر",
  },
];

type ProjectTab =
  | "overview"
  | "docs"
  | "inspections"
  | "certificates"
  | "stamps"
  | "capa"
  | "closure";

type ProjectStamp = {
  id: string;
  projectId: string;
  type: string;
  date: string;
  stampId: string;
  scale: number;
  position: { x: number; y: number };
};

const processSteps = [
  {
    id: "evaluation",
    label: "ارزیابی فنی",
    detail: "چک کردن مدارک طراحی و ثبت یافته‌های میدانی",
    accent: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    id: "review",
    label: "مرور و بازبینی",
    detail: "مرور همتا و هماهنگی با استاندارد AsiaClass",
    accent: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    id: "approval",
    label: "تایید مدارک",
    detail: "صدور تاییدیه فنی و آماده‌سازی بسته مستندات",
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "signature",
    label: "مهر و امضای دیجیتال",
    detail: "ثبت امضای الکترونیکی و مهر سازمانی روی نسخه نهایی",
    accent: "bg-purple-50 text-purple-700 border-purple-100",
  },
];

const signatureQueue = [
  {
    id: "sig-2045",
    title: "مستند طراحی بدنه UTN-2045",
    owner: "سارا رحیمی",
    due: "امروز ۱۵:۰۰",
    status: "در انتظار مهر",
  },
  {
    id: "sig-1980",
    title: "چک‌لیست ممیزی UTN-1980",
    owner: "الهام داوودی",
    due: "فردا ۱۰:۳۰",
    status: "آماده امضا",
  },
];

export function TechnicianWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeProject, setActiveProject] = useState<WorkspaceProject | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");
  const [stampType, setStampType] = useState("Approved");
  const [stampDate, setStampDate] = useState("2025-12-02");
  const [stampId, setStampId] = useState("");
  const [stampScale, setStampScale] = useState(1);
  const [stampPosition, setStampPosition] = useState({ x: 60, y: 40 });
  const [savedStamps, setSavedStamps] = useState<ProjectStamp[]>([]);

  useEffect(() => {
    const anchorFromState =
      typeof location.state === "object" && location.state !== null
        ? (location.state as { anchor?: string }).anchor
        : undefined;

    const anchor = (location.hash || "").replace("#", "") || anchorFromState;
    if (!anchor) return;

    const scrollToAnchor = () => {
      const target =
        document.getElementById(anchor) ||
        document.getElementById(`workspace-${anchor}`);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }

      return false;
    };

    if (!scrollToAnchor()) {
      const timer = window.setTimeout(scrollToAnchor, 350);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [location.hash, location.state]);

  const openEvaluationModal = (project: WorkspaceProject) => {
    setActiveProject(project);
    setActiveTab("overview");
    setIsProjectModalOpen(true);
  };

  const openDigitalStampModal = (project: WorkspaceProject) => {
    setActiveProject(project);
    setActiveTab("stamps");
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setActiveProject(null);
  };

  const handleStampSave = () => {
    if (!activeProject) return;
    const newStamp: ProjectStamp = {
      id: `${activeProject.id}-${Date.now()}`,
      projectId: activeProject.id,
      type: stampType,
      date: stampDate,
      stampId: stampId || activeProject.utn,
      scale: stampScale,
      position: stampPosition,
    };

    setSavedStamps((prev) => [newStamp, ...prev]);
    setStampId("");
  };

  const projectStamps = useMemo(
    () =>
      activeProject
        ? savedStamps.filter((stamp) => stamp.projectId === activeProject.id)
        : [],
    [activeProject, savedStamps],
  );

  const handlePlanClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setStampPosition({ x, y });
  };

  const evaluationFeatures = [
    "بررسی مدارک طراحی و آپلود فایل‌های اصلاح‌شده",
    "ثبت نتایج بازرسی میدانی و چک‌لیست‌ها",
    "ثبت نظرات و سوالات فنی برای تیم طراحی",
    "تکمیل گزارش نهایی ارزیابی و ارسال برای مدیر فنی",
    "علامت‌گذاری موارد ضروری برای CAPA",
  ];

  const tabs = useMemo(() => {
    const counts = {
      docs: activeProject?.docsCount ?? 0,
      inspections: activeProject?.inspectionsCount ?? 0,
      certificates: activeProject?.certificatesCount ?? 0,
      stamps: activeProject?.stampsCount ?? 0,
      capa: activeProject?.capaCount ?? 0,
    };

    return [
      { id: "overview" as ProjectTab, label: "نمای کلی" },
      { id: "docs" as ProjectTab, label: `مدارک (${counts.docs})` },
      { id: "inspections" as ProjectTab, label: `بازرسی‌ها (${counts.inspections})` },
      { id: "certificates" as ProjectTab, label: `گواهینامه‌ها (${counts.certificates})` },
      { id: "stamps" as ProjectTab, label: `مهرها (${counts.stamps})` },
      { id: "capa" as ProjectTab, label: `CAPA (${counts.capa})` },
      { id: "closure" as ProjectTab, label: "بسته‌شدن" },
    ];
  }, [activeProject]);

  const stampVisualStyle = useMemo(() => {
    switch (stampType) {
      case "Rejected":
        return { background: "rgb(254,242,242)", border: "rgb(239,68,68)", text: "rgb(185,28,28)" };
      case "ForReview":
        return { background: "rgb(239,246,255)", border: "rgb(59,130,246)", text: "rgb(37,99,235)" };
      case "Conditional":
        return { background: "rgb(255,251,235)", border: "rgb(249,115,22)", text: "rgb(194,65,12)" };
      case "ForInfo":
        return { background: "rgb(240,249,255)", border: "rgb(59,130,246)", text: "rgb(37,99,235)" };
      default:
        return { background: "rgb(236, 253, 243)", border: "rgb(22, 163, 74)", text: "rgb(21, 128, 61)" };
    }
  }, [stampType]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 text-right" id="desk">
        <header className="flex flex-wrap items-start justify-between gap-4 flex-row">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">میز مرور پروژه‌ها</p>
            <h1 className="text-3xl font-bold text-gray-900">داشبورد کار فنی</h1>
            <p className="text-gray-600">
              پرونده‌ها را بر اساس مسیر AsiaClass بررسی کنید؛ ارزیابی، بازبینی، تایید و در نهایت مهر و امضای دیجیتال را یکجا انجام دهید.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-row">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => navigate("/dashboard/technician")}
            >
              <Icon name="arrowDownRight" size={16} className="ml-2" />
              بازگشت به داشبورد فنی
            </Button>
            <Button variant="primary" className="text-sm" onClick={() => navigate("/dashboard/technician?tab=workbench") }>
              <Icon name="layers" size={16} className="ml-2" />
              بازکردن میز کار قبلی
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="شاخص‌های هم‌راستایی AsiaClass">
          {["۳ پروژه فعال", "۵۵ سند فنی", "۴ مهر دیجیتال", "هم‌راستایی با AsiaClass"].map((item, index) => (
            <Card key={item} className="p-4 border border-gray-100 bg-white" role="article">
              <div className="flex items-center justify-between flex-row">
                <span className="text-sm text-gray-500">شاخص {index + 1}</span>
                <Icon name="check" size={16} className="text-emerald-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900 mt-2 text-right">{item}</div>
              <p className="text-xs text-gray-500 mt-1">آپدیت اتوماتیک با داده‌های AsiaClass</p>
            </Card>
          ))}
        </section>

        <Card
          className="p-5 border border-gray-100 bg-white"
          id="workspace-desk"
          aria-label="میز پروژه‌های قابل اقدام"
        >
          <div className="flex items-center justify-between mb-4 flex-row">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">میز پروژه‌های فعال</h2>
              <p className="text-sm text-gray-600">بررسی، بازبینی و تایید مدارک طراحی با امکان مهر دیجیتال</p>
            </div>
            <Button variant="secondary" className="text-sm" onClick={() => navigate("/projects") }>
              <Icon name="file" size={16} className="ml-2" />
              همه پروژه‌ها
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {mockProjects.map((project) => (
              <div key={project.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between flex-row">
                  <span className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white">{project.utn}</span>
                  <span className="text-xs text-gray-500">{project.stage}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-600">مسئول: {project.owner} · منطقه: {project.region}</p>

                <div className="flex items-center justify-between text-xs text-gray-600 flex-row">
                  <span>مهرهای صادرشده: {project.stampsCount}</span>
                  <span className="text-emerald-700">همسو با AsiaClass</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">{project.docsReady}/{project.docsTotal} سند آماده</span>
                  <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">{project.review}</span>
                  <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">{project.approval}</span>
                  <span className="px-2 py-1 rounded-lg bg-white border border-gray-200">{project.signature}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="primary" className="text-sm" onClick={() => openEvaluationModal(project)}>
                    <Icon name="check" size={14} className="ml-2" />
                    تکمیل ارزیابی
                  </Button>
                  <Button variant="secondary" className="text-sm" onClick={() => openDigitalStampModal(project)}>
                    <Icon name="clipboard" size={14} className="ml-2" />
                    امضا و مهر دیجیتال
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4 border border-gray-100 bg-white space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between flex-row">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">مسیر کامل ارزیابی و تایید</h3>
                <p className="text-sm text-gray-600">از بررسی اولیه تا مهر دیجیتال مطابق استاندارد AsiaClass</p>
              </div>
              <Button variant="ghost" className="text-sm" onClick={() => navigate("/dashboard/technician?tab=teamCalendar") }>
                <Icon name="calendar" size={16} className="ml-2" />
                هماهنگی تقویمی
              </Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border text-right ${step.accent} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}
                >
                  <div className="flex items-center justify-between flex-row">
                    <span className="text-xs text-gray-500">گام {index + 1}</span>
                    <Icon name="arrowUpRight" size={14} />
                  </div>
                  <p className="font-semibold text-gray-900 mt-1">{step.label}</p>
                  <p className="text-sm text-gray-700 leading-6">{step.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 border border-gray-100 bg-white space-y-3">
            <div className="flex items-center justify-between flex-row">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">صف امضا و مهر</h3>
                <p className="text-sm text-gray-600">مدارک آماده امضا و مهر دیجیتال</p>
              </div>
              <Button variant="secondary" className="text-sm" onClick={() => navigate("/projects") }>
                <Icon name="file" size={14} className="ml-2" />
                مدیریت مدارک
              </Button>
            </div>
            <div className="space-y-2">
              {signatureQueue.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600">مسئول: {item.owner} · موعد: {item.due}</p>
                  <div className="flex items-center justify-between mt-2 flex-row">
                    <span className="text-xs text-indigo-700">{item.status}</span>
                    <div className="flex gap-2 flex-row">
                      <Button variant="ghost" className="text-xs px-3" onClick={() => navigate(`/projects/${item.id}?action=review`)}>
                        بازبینی
                      </Button>
                      <Button variant="primary" className="text-xs px-3" onClick={() => navigate(`/projects/${item.id}?action=sign`)}>
                        امضای دیجیتال
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5 border border-indigo-200 bg-indigo-50">
          <div className="flex items-center gap-3 flex-row">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Icon name="shield" size={18} />
            </div>
            <div>
              <p className="text-sm text-indigo-700">همراستایی با AsiaClass</p>
              <h3 className="text-lg font-semibold text-gray-900">تمام مهرها و امضاها مطابق استاندارد AsiaClass نگهداری می‌شوند.</h3>
              <p className="text-sm text-gray-700">برای مشاهده جزئیات و نمونه‌ها به <a className="text-indigo-600 underline" href="https://asiaclass.org/en/" target="_blank" rel="noreferrer">asiaclass.org</a> سر بزنید.</p>
            </div>
          </div>
        </Card>

        {isProjectModalOpen && activeProject ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-10 bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={closeProjectModal} aria-label="بستن" />
            <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden" dir="rtl">
              <div className="flex items-start justify-between border-b border-gray-200 p-6 flex-row">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-row">
                    <span className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-gray-50">{activeProject.utn}</span>
                    <span className="text-xs text-gray-500">{activeProject.region}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {activeProject.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{activeProject.title}</h3>
                  <p className="text-sm text-gray-600">مسئول: {activeProject.owner}</p>
                </div>
                <Button variant="ghost" className="text-sm" onClick={closeProjectModal}>
                  بستن
                </Button>
              </div>

              <div className="border-b border-gray-200 px-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-black border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-4">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <Card className="p-4 border border-gray-100 bg-gray-50">
                      <div className="grid gap-2 md:grid-cols-3 text-sm text-gray-700">
                        <span>نام پروژه: {activeProject.title}</span>
                        <span>UTN: {activeProject.utn}</span>
                        <span>کارفرما / مالک: {activeProject.owner}</span>
                        <span>منطقه: {activeProject.region}</span>
                        <span>وضعیت: {activeProject.status}</span>
                        <span>مرحله فعلی: {activeProject.stage}</span>
                      </div>
                    </Card>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Card className="p-4 border border-gray-100 bg-white space-y-3">
                        <h4 className="font-semibold text-gray-900">اقدامات ارزیابی</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {evaluationFeatures.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 flex-row">
                              <Icon name="check" size={16} className="text-emerald-600 mt-1" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="p-4 border border-gray-100 bg-white space-y-3">
                        <h4 className="font-semibold text-gray-900">میانبرهای اقدام</h4>
                        <div className="flex flex-col gap-2 text-sm">
                          <Button variant="secondary" className="justify-between">
                            <span>باز کردن پرونده پروژه</span>
                            <Icon name="arrowUpRight" size={14} />
                          </Button>
                          <Button variant="ghost" className="justify-between">
                            <span>مشاهده مدارک</span>
                            <Icon name="file" size={14} />
                          </Button>
                          <Button variant="ghost" className="justify-between">
                            <span>ثبت گزارش جدید</span>
                            <Icon name="edit" size={14} />
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "docs" && (
                  <Card className="p-4 border border-gray-100 bg-white space-y-3">
                    <h4 className="font-semibold text-gray-900">مدارک پروژه</h4>
                    <p className="text-sm text-gray-700">{activeProject.docsCount} مدرک برای این پروژه ثبت شده است.</p>
                    <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-700">
                      {["نقشه طراحی", "چک‌لیست ایمنی", "محاسبات سازه", "دفترچه تجهیزات"].slice(0, activeProject.docsCount >= 4 ? 4 : 3).map((doc) => (
                        <div key={doc} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between flex-row">
                          <span>{doc}</span>
                          <Button variant="ghost" className="text-xs px-3">باز کردن</Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === "inspections" && (
                  <Card className="p-4 border border-gray-100 bg-white space-y-3">
                    <h4 className="font-semibold text-gray-900">بازرسی‌های ثبت‌شده</h4>
                    <p className="text-sm text-gray-700">{activeProject.inspectionsCount} بازرسی برای این پروژه ثبت شده است.</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      {["بازرسی میدانی", "چک‌لیست کیفیت", "تایید تطابق AsiaClass"].slice(0, Math.max(1, activeProject.inspectionsCount)).map((item, index) => (
                        <div key={`${item}-${index}`} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between flex-row">
                          <span>{item}</span>
                          <span className="text-xs text-gray-500">در انتظار تایید</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === "certificates" && (
                  <Card className="p-4 border border-gray-100 bg-white space-y-3">
                    <h4 className="font-semibold text-gray-900">گواهینامه‌ها</h4>
                    <p className="text-sm text-gray-700">{activeProject.certificatesCount} گواهینامه برای این پروژه تعریف شده است.</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      {activeProject.certificatesCount > 0 ? (
                        Array.from({ length: activeProject.certificatesCount }).map((_, index) => (
                          <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between flex-row">
                            <span>گواهینامه #{index + 1}</span>
                            <Button variant="ghost" className="text-xs px-3">دانلود</Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">گواهینامه‌ای ثبت نشده است.</p>
                      )}
                    </div>
                  </Card>
                )}

                {activeTab === "stamps" && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-gray-200">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? "border-b-2 border-black text-black"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">مهرهای ثبت‌شده روی نقشه / طراحی پروژه</p>
                        <span className="text-xs text-gray-500">برای جابجایی محل مهر، داخل پلان کلیک کنید</span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div
                            className="relative bg-slate-50 rounded-xl border border-dashed border-slate-300 h-72 cursor-crosshair overflow-hidden"
                            onClick={handlePlanClick}
                          >
                            <div className="absolute inset-4 border border-slate-300/70 rounded-lg pointer-events-none" />
                            <div className="absolute inset-6 grid grid-cols-6 grid-rows-4 opacity-40 pointer-events-none" />

                            <div
                              className="absolute opacity-70 pointer-events-none"
                              style={{
                                left: `${stampPosition.x}%`,
                                top: `${stampPosition.y}%`,
                                transform: "translate(-50%, -50%) scale(1)",
                              }}
                            >
                              <div
                                className="rounded-xl px-4 py-2 border-2 text-center shadow-sm"
                                style={{
                                  backgroundColor: stampVisualStyle.background,
                                  borderColor: stampVisualStyle.border,
                                  color: stampVisualStyle.text,
                                  minWidth: "180px",
                                  transform: `scale(${stampScale})`,
                                }}
                              >
                                <div className="text-xs font-extrabold tracking-[0.35em] mb-1">{stampType.toUpperCase()}</div>
                                <div className="text-sm font-semibold mb-1">
                                  {new Date(stampDate).toLocaleDateString("fa-IR")}
                                </div>
                                <div className="flex justify-between text-[11px] mt-1">
                                  <span> Date: {new Date(stampDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                  <span className="ml-2">ID: {stampId || activeProject.utn}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            برای تعیین محل مهر، داخل کادر بالا کلیک کنید. تا زمانی که روی «ذخیره مهر روی پلان» بزنید، فقط به‌صورت پیش‌نمایش نمایش داده می‌شود.
                          </p>
                        </div>

                        <div className="w-full lg:w-72 space-y-4">
                          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">تنظیمات مهر</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-gray-800 bg-white border border-slate-200 text-xs">
                                تأیید شده
                              </span>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">نوع مهر</label>
                              <select
                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={stampType}
                                onChange={(e) => setStampType(e.target.value)}
                              >
                                <option value="Approved">تأیید شده (سبز)</option>
                                <option value="Rejected">رد شده (قرمز)</option>
                                <option value="ForReview">برای بررسی (آبی / بنفش)</option>
                                <option value="Conditional">تأیید مشروط (نارنجی)</option>
                                <option value="ForInfo">برای اطلاع (آبی روشن)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">تاریخ مهر</label>
                              <input
                                type="date"
                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={stampDate}
                                onChange={(e) => setStampDate(e.target.value)}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">شناسه / ID مهر</label>
                              <input
                                type="text"
                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="مثلاً ASC-APP-001 یا UTN"
                                value={stampId}
                                onChange={(e) => setStampId(e.target.value)}
                              />
                              <p className="mt-1 text-[11px] text-gray-500">اگر خالی بگذارید، به‌صورت خودکار از UTN پروژه استفاده می‌شود.</p>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">اندازه مهر</label>
                              <input
                                type="range"
                                min="0.7"
                                max="1.6"
                                step="0.1"
                                className="w-full"
                                value={stampScale}
                                onChange={(e) => setStampScale(Number(e.target.value))}
                              />
                              <p className="mt-1 text-[11px] text-gray-500">بزرگ‌نمایی فعلی: {Math.round(stampScale * 100)}%</p>
                            </div>

                            <button
                              className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 px-3 py-1.5 text-sm w-full mt-2"
                              onClick={handleStampSave}
                            >
                              ذخیره مهر روی پلان
                            </button>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-3 max-h-60 overflow-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-900">لیست مهرهای ثبت‌شده</span>
                              <span className="text-[11px] text-gray-500">
                                {projectStamps.length === 0 ? "مهر فعالی ثبت نشده است" : `${projectStamps.length} مهر`}
                              </span>
                            </div>
                            {projectStamps.length === 0 ? (
                              <p className="text-xs text-gray-500">بعد از ثبت هر مهر، در این لیست نمایش داده می‌شود.</p>
                            ) : (
                              <div className="space-y-2 text-sm text-gray-700">
                                {projectStamps.map((stamp) => (
                                  <div key={stamp.id} className="p-2 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-between flex-row">
                                    <div>
                                      <p className="text-xs font-semibold">{stamp.type}</p>
                                      <p className="text-[11px] text-gray-500">{stamp.stampId}</p>
                                    </div>
                                    <span className="text-[11px] text-gray-500">{stamp.date}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "capa" && (
                  <Card className="p-4 border border-gray-100 bg-white space-y-3">
                    <h4 className="font-semibold text-gray-900">CAPA</h4>
                    <p className="text-sm text-gray-700">{activeProject.capaCount} آیتم نیازمند اقدام اصلاحی/پیشگیرانه ثبت شده است.</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      {Array.from({ length: Math.max(1, activeProject.capaCount) }).map((_, index) => (
                        <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between flex-row">
                          <span>مورد {index + 1}</span>
                          <span className="text-xs text-amber-600">در حال پیگیری</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === "closure" && (
                  <Card className="p-4 border border-gray-100 bg-white space-y-3">
                    <h4 className="font-semibold text-gray-900">بسته‌شدن پروژه</h4>
                    <p className="text-sm text-gray-700">پس از تکمیل همه گام‌ها، وضعیت پروژه به تکمیل شده تغییر می‌کند.</p>
                    <Button variant="primary" className="text-sm w-full">درخواست بسته‌شدن</Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

export default TechnicianWorkspace;
