import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the User aggregate. */
export interface UserResponse extends BaseResponse {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  companyId: number | string | null;
}

/** Resource returned by the sign-in endpoint. */
export interface AuthenticatedUserResponse extends BaseResponse {
  username: string;
  token: string;
}
