import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User, UserRole } from '../domain/model/user.entity';
import { UserResponse } from './user.response';

/** Translates User resources into User entities and the other way around. */
export class UserAssembler implements BaseAssembler<User, UserResponse> {
  toEntityFromResource(resource: UserResponse): User {
    return new User({
      id: resource.id,
      username: resource.username,
      email: resource.email,
      fullName: resource.fullName,
      roles: (resource.roles ?? []) as UserRole[],
      companyId: resource.companyId
    });
  }

  toEntitiesFromResponse(response: UserResponse[]): User[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: User): UserResponse {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      fullName: entity.fullName,
      roles: entity.roles,
      companyId: entity.companyId
    };
  }
}
