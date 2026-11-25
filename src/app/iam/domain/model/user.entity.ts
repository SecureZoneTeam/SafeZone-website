import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Role of a NodeSecure user inside its organization (RBAC, user story US17).
 * Access is decided by granular permissions; the role only defines the default ones.
 */
export enum UserRole {
  Owner = 'ROLE_OWNER',
  Supervisor = 'ROLE_SUPERVISOR',
  Operator = 'ROLE_OPERATOR'
}

/** User aggregate of the Identity and Access Management bounded context. */
export class User implements BaseEntity {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  companyId: number | string | null;

  constructor(user: {
    id?: number | string;
    username?: string;
    email?: string;
    fullName?: string;
    roles?: UserRole[];
    companyId?: number | string | null;
  }) {
    this.id = user.id ?? 0;
    this.username = user.username ?? '';
    this.email = user.email ?? '';
    this.fullName = user.fullName ?? '';
    this.roles = user.roles ?? [];
    this.companyId = user.companyId ?? null;
  }

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }
}
