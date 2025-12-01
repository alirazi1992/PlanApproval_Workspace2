import React from "react";
import DateObject from "react-date-object";
import persianCalendar from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import { ProjectFilters } from "../../services/projectService";

interface ActiveProjectsFilterBarProps {
  filters: ProjectFilters;
  onChangeFilters: (next: ProjectFilters) => void;
  showUnitFilter?: boolean;
  availableUnits?: { id: string; name: string }[];
}

export function ActiveProjectsFilterBar({
  filters,
  onChangeFilters,
  showUnitFilter = false,
  availableUnits = [],
}: ActiveProjectsFilterBarProps) {
  const handleChange = (key: keyof ProjectFilters, value: string | undefined) => {
    onChangeFilters({ ...filters, [key]: value });
  };

  const convertToISO = (date: DateObject | string | Date | null) =>
    date && typeof (date as DateObject).toDate === "function"
      ? (date as DateObject).toDate().toISOString().split("T")[0]
      : typeof date === "string"
      ? date
      : null;

  const handleDateChange = (key: "fromDate" | "toDate", value: DateObject | null) => {
    const iso = convertToISO(value) || undefined;
    onChangeFilters({ ...filters, [key]: iso });
  };

  const getDateValue = (value?: string) =>
    value
      ? new DateObject({
          date: value,
          calendar: persianCalendar,
          locale: persian_fa,
        })
      : null;

  return (
    <div className="p-4 mb-4 rounded-xl border border-gray-100 bg-white space-y-3 text-right">
      <div className="grid gap-3 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-gray-700">
          <span className="block text-gray-600">وضعیت</span>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.status ?? "All"}
            onChange={(e) => handleChange("status", e.target.value as ProjectFilters["status"])}
          >
            <option value="All">همه</option>
            <option value="Normal">عادی</option>
            <option value="TrackFast">Track-Fast</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-gray-700">
          <span className="block text-gray-600">جستجو</span>
          <input
            type="text"
            placeholder="کد یا عنوان پروژه"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.search ?? ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </label>

        {showUnitFilter && (
          <label className="space-y-1 text-sm text-gray-700">
            <span className="block text-gray-600">واحد</span>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.unitId ?? ""}
              onChange={(e) => handleChange("unitId", e.target.value || undefined)}
            >
              <option value="">همه واحدها</option>
              {availableUnits.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="space-y-1 text-sm text-gray-700">
          <span className="block text-gray-600">از تاریخ</span>
          <DatePicker
            calendar={persianCalendar}
            locale={persian_fa}
            inputClass="w-full text-right border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            containerClassName="w-full"
            value={getDateValue(filters.fromDate)}
            onChange={(val) => handleDateChange("fromDate", val as DateObject | null)}
            placeholder="از تاریخ"
          />
        </label>

        <label className="space-y-1 text-sm text-gray-700">
          <span className="block text-gray-600">تا تاریخ</span>
          <DatePicker
            calendar={persianCalendar}
            locale={persian_fa}
            inputClass="w-full text-right border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            containerClassName="w-full"
            value={getDateValue(filters.toDate)}
            onChange={(val) => handleDateChange("toDate", val as DateObject | null)}
            placeholder="تا تاریخ"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <label className="flex items-center gap-2 flex-row text-gray-700">
          <input
            type="radio"
            name="sort"
            value="DueDate"
            checked={filters.sort === "DueDate"}
            onChange={(e) => handleChange("sort", (e.target as HTMLInputElement).value as ProjectFilters["sort"])}
          />
          نزدیک‌ترین موعد
        </label>
        <label className="flex items-center gap-2 flex-row text-gray-700">
          <input
            type="radio"
            name="sort"
            value="TrackFast"
            checked={filters.sort === "TrackFast"}
            onChange={(e) => handleChange("sort", (e.target as HTMLInputElement).value as ProjectFilters["sort"])}
          />
          Track-Fast اول
        </label>
        <label className="flex items-center gap-2 flex-row text-gray-700">
          <input
            type="radio"
            name="sort"
            value="Delay"
            checked={filters.sort === "Delay"}
            onChange={(e) => handleChange("sort", (e.target as HTMLInputElement).value as ProjectFilters["sort"])}
          />
          بیشترین تاخیر
        </label>
        <label className="flex items-center gap-2 flex-row text-gray-700">
          <input
            type="radio"
            name="sort"
            value="Alphabetical"
            checked={filters.sort === "Alphabetical"}
            onChange={(e) => handleChange("sort", (e.target as HTMLInputElement).value as ProjectFilters["sort"])}
          />
          مرتب‌سازی الفبایی
        </label>
      </div>
    </div>
  );
}
