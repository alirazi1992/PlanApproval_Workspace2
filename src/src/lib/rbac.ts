import { UserProfile } from "../features/auth/AuthContext";

export type ProjectScope =
  | { organizationWide: true }
  | { unit: string; includeSubUnits?: boolean }
  | { clientId?: string; clientName?: string }
  | { unit?: string };

export function getProjectScopeForUser(user: UserProfile & { unitId?: string; clientId?: string }): ProjectScope {
  if (user.role === "technician" || user.role === "TechnicalExpert") {
    return { unit: user.unitId ?? "واحد طراحی" };
  }

  if (user.role === "UnitManager") {
    return { unit: user.unitId ?? "واحد طراحی", includeSubUnits: true };
  }

  if (user.role === "ClientRepresentative" || user.role === "client") {
    return { clientId: user.clientId, clientName: user.name };
  }

  return { organizationWide: true };
}
