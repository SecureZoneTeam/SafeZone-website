import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { User } from '../domain/model/user.entity';
import { UserResponse } from './user.response';
import { UserAssembler } from './user.assembler';
import { environment } from '../../../environments/environment';

const usersResourceEndpointPath = '/users';

/** API endpoint for the User aggregate. */
@Injectable({ providedIn: 'root' })
export class UsersApiEndpoint extends BaseApiEndpoint<User, UserResponse, UserAssembler> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${usersResourceEndpointPath}`,
      new UserAssembler()
    );
  }
}
