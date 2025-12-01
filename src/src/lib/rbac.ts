import { UserProfile } from "../features/auth/AuthContext";

export type ProjectScope =
  | { scope: "all" }
  | { scope: "unit"; unitId: string }
  | { scope: "department"; departmentId: string }
  | { scope: "client"; clientId?: string; clientName?: string }
  | { scope: "limited" };

export function getProjectScopeForUser(user: UserProfile): ProjectScope {
  switch (user.role) {
    case "admin":
      return { scope: "all" };
    case "technician":
      return { scope: "unit", unitId: "واحد طراحی" };
    case "client":
      return { scope: "client", clientName: user.name };
    default:
      return { scope: "limited" };
  }
}
