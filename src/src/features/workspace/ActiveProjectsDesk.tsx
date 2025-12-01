import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import {
  getActiveProjects,
  ProjectFilters,
  signProjectDocuments,
} from "../../services/projectService";
import { ActiveProject } from "../../types/projects";
import { ActiveProjectsFilterBar } from "./ActiveProjectsFilterBar";
import { logDashboardAction } from "../../services/auditService";
import { getProjectScopeForUser } from "../../lib/rbac";

function useActiveProjectsDesk(filters: ProjectFilters) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scope = useMemo(() => (user ? getProjectScopeForUser(user) : null), [user]);

  const fetchProjects = useCallback(async () => {
    if (!user || !scope) return;
    setIsLoading(true);
    try {
      const data = await getActiveProjects(scope, filters);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, scope, user]);

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [fetchProjects, user]);

  return { projects, isLoading, error, refetch: fetchProjects, setProjects, scope };
}

function sortProjects(projects: ActiveProject[], sort?: ProjectFilters["sort"]) {
  const list = [...projects];
  switch (sort) {
    case "TrackFast":
      return list.sort((a, b) => (a.status === "TrackFast" ? -1 : 1) - (b.status === "TrackFast" ? -1 : 1));
    case "Delay":
      return list.sort((a, b) => a.progressPercent - b.progressPercent);
    case "Alphabetical":
      return list.sort((a, b) => a.code.localeCompare(b.code, "fa"));
    case "DueDate":
    default:
      return list.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  }
}

function EvaluationStatusText({ status }: { status: ActiveProject["evaluationStatus"] }) {
  const map: Record<ActiveProject["evaluationStatus"], string> = {
    NotStarted: "شروع نشده",
    InProgress: "در حال بررسی",
    WaitingClient: "در انتظار پاسخ مشتری",
    Completed: "تکمیل شده",
  };
  return <span className="text-sm text-gray-700">{map[status]}</span>;
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-600 flex-row">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-indigo-600"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function ActiveProjectsDesk() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState<ProjectFilters>({ status: "All", sort: "DueDate" });
  const { projects, isLoading, error, refetch, setProjects, scope } = useActiveProjectsDesk(filters);

  useEffect(() => {
    if (!user) return;
    logDashboardAction({ action: "ViewActiveProjects", userId: user.email, metadata: { scope } });
  }, [scope, user]);

  const handleFiltersChange = (next: ProjectFilters) => {
    setFilters(next);
    if (user) {
      logDashboardAction({ action: "ChangeFilters", userId: user.email, metadata: next });
    }
  };

  const sortedProjects = useMemo(() => sortProjects(projects, filters.sort), [filters.sort, projects]);

  const handleOpenProject = (projectId: string) => {
    if (!user) return;
    logDashboardAction({ action: "OpenProject", projectId, userId: user.email });
    navigate(`/workspace/projects/${projectId}`);
  };

  const handleOpenReview = (projectId: string) => {
    if (!user) return;
    logDashboardAction({ action: "OpenReview", projectId, userId: user.email });
    navigate(`/workspace/projects/${projectId}/review`);
  };

  const handleDigitalSign = async (projectId: string) => {
    if (!user) return;
    logDashboardAction({ action: "SignDigital", projectId, userId: user.email });
    await signProjectDocuments(projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, hasDigitalSignature: true } : p)));
  };

  const availableUnits = useMemo(
    () =>
      Array.from(new Set(projects.map((p) => p.unitName))).map((name, index) => ({
        id: `unit-${index}`,
        name,
      })),
    [projects]
  );

  return (
    <Card className="p-5 border border-gray-100 bg-white" id="workspace-desk">
      <div className="flex items-center justify-between mb-4 flex-row">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">میز پروژه‌های فعال</h2>
          <p className="text-sm text-gray-600">بررسی، بازبینی و تایید مدارک طراحی با امکان مهر دیجیتال</p>
        </div>
        <div className="flex items-center gap-2 flex-row">
          <Button variant="secondary" className="text-sm" onClick={() => navigate("/projects") }>
            <Icon name="file" size={16} className="ml-2" />
            همه پروژه‌ها
          </Button>
        </div>
      </div>

      <ActiveProjectsFilterBar
        filters={filters}
        onChangeFilters={handleFiltersChange}
        showUnitFilter={user?.role === "admin"}
        availableUnits={availableUnits}
      />

      {isLoading && (
        <div className="grid gap-4 lg:grid-cols-3" aria-label="در حال بارگذاری">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
              <div className="h-5 bg-gray-200 rounded w-32 ml-auto" />
              <div className="h-4 bg-gray-200 rounded w-40 ml-auto" />
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between flex-row">
          <span>خطا در دریافت اطلاعات</span>
          <Button variant="ghost" className="text-sm" onClick={refetch}>
            تلاش مجدد
          </Button>
        </div>
      )}

      {!isLoading && !error && sortedProjects.length === 0 && (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm">
          هیچ پروژه فعالی در محدوده شما یافت نشد.
        </div>
      )}

      {!isLoading && !error && sortedProjects.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <div key={project.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3" dir="rtl">
              <div className="flex items-center justify-between flex-row">
                <span className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white">{project.code}</span>
                <span className="text-xs text-gray-500">{project.unitName}</span>
              </div>
              <div className="flex items-center justify-between flex-row">
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                {project.status === "TrackFast" ? (
                  <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold">Track-Fast</span>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs">عادی</span>
                )}
              </div>
              <p className="text-sm text-gray-600">کارفرما: {project.clientName} · موقعیت: {project.location}</p>
              <p className="text-sm text-gray-600">مسئول: {project.responsible}</p>

              <ProgressBar value={project.progressPercent} label="پیشرفت کلی پروژه" />
              <ProgressBar value={project.documentsProgressPercent} label="پیشرفت بازبینی مدارک" />

              <div className="flex items-center justify-between text-xs text-gray-600 flex-row">
                <EvaluationStatusText status={project.evaluationStatus} />
                {project.hasDigitalSignature ? (
                  <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">امضا شده</span>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-700">نیاز به امضا</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 flex-row">
                {project.dueDate && <span>موعد: {project.dueDate}</span>}
                {project.lastUpdate && <span>آخرین به‌روزرسانی: {project.lastUpdate}</span>}
                {(scope as any)?.organizationWide && <span>{project.unitName}</span>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <Icon name="arrowUpRight" size={14} className="ml-2" />
                  باز کردن پرونده
                </Button>
                <Button
                  variant="primary"
                  className="text-sm"
                  disabled={project.evaluationStatus === "Completed"}
                  onClick={() => handleOpenReview(project.id)}
                >
                  <Icon name="check" size={14} className="ml-2" />
                  تکمیل ارزیابی
                </Button>
                <Button
                  variant="secondary"
                  className="text-sm"
                  onClick={() => handleDigitalSign(project.id)}
                  disabled={project.hasDigitalSignature}
                >
                  <Icon name="clipboard" size={14} className="ml-2" />
                  امضا و مهر دیجیتال
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
