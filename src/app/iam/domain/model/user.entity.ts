import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Role granted to a NodeSecure user (RBAC, user story US17). */
export enum UserRole {
  Administrator = 'ROLE_ADMINISTRATOR',
  SecurityManager = 'ROLE_SECURITY_MANAGER',
  WarehouseKeeper = 'ROLE_WAREHOUSE_KEEPER',
  Auditor = 'ROLE_AUDITOR'
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
