import { UserProfile } from "../features/auth/AuthContext";

export type ProjectScope =
  | { organizationWide: true }
  | { unit: string; includeSubUnits?: boolean }
  | { clientId?: string; clientName?: string }
  | { unit?: string };

export function getProjectScopeForUser(user: UserProfile & { unitId?: string; clientId?: string }): ProjectScope {
  if (user.role === "technician" || user.role === "TechnicalExpert") {
    return user.unitId ? { unit: user.unitId } : { organizationWide: true };
  }

  if (user.role === "UnitManager") {
    return user.unitId ? { unit: user.unitId, includeSubUnits: true } : { organizationWide: true };
  }

  if (user.role === "ClientRepresentative" || user.role === "client") {
    return { clientId: user.clientId, clientName: user.name };
  }

  return { organizationWide: true };
}
