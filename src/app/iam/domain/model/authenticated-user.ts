/**
 * Session context of the signed-in user, always taken from the API (sign-in, sign-up or GET /authentication/me).
 * It is never trusted for security: the backend validates organization, permissions and warehouses on every request.
 */
export interface AuthenticatedUser {
  id: number | string;
  username: string;
  token: string;
  fullName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  /** True for the owner: every warehouse of the organization is reachable. */
  allWarehouses?: boolean;
  warehouseIds?: number[];
  warehouseId?: number | null;
  organizationId?: number | null;
  organizationName?: string | null;
}
