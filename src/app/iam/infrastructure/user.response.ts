import { BaseResponse } from '@shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the User aggregate. */
export interface UserResponse extends BaseResponse {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  companyId: number | string | null;
}

/** Resource returned by sign-in, sign-up and GET /authentication/me (token is null for /me). */
export interface AuthenticatedUserResponse extends BaseResponse {
  username: string;
  token: string | null;
  fullName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  allWarehouses?: boolean;
  warehouseIds?: number[];
  warehouseId?: number | null;
  organizationId?: number | null;
  organizationName?: string | null;
}
