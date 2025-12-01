import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ActiveProjectsDesk } from "../features/workspace/ActiveProjectsDesk";

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

export function WorkspaceProjects() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const anchorFromState =
      typeof location.state === "object" && location.state !== null
        ? (location.state as { anchor?: string }).anchor
        : undefined;

    const anchor = (location.hash || "").replace("#", "") || anchorFromState;
    if (!anchor) return;

    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return undefined;
  }, [location.hash, location.state]);

  return (
    <AppShell>
      <div dir="rtl" lang="fa" className="max-w-7xl mx-auto space-y-6 text-right" id="desk">
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

        <div id="workspace-desk-anchor">
          <ActiveProjectsDesk />
        </div>

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
                      <Button variant="ghost" className="text-xs px-3" onClick={() => navigate(`/workspace/projects/${item.id}?action=review`)}>
                        بازبینی
                      </Button>
                      <Button variant="primary" className="text-xs px-3" onClick={() => navigate(`/workspace/projects/${item.id}?action=sign`)}>
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
      </div>
    </AppShell>
  );
}

export default WorkspaceProjects;
