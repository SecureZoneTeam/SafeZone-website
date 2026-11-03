import { HttpClient } from '@angular/common/http';
import { BaseEntity } from '../domain/model/base-entity';
import { BaseApiEndpoint } from './base-api.endpoint';
import { BaseAssembler } from './base-assembler';
import { BaseResponse } from './base-response';

interface TestResponse extends BaseResponse {
  name: string;
}

class TestEntity implements BaseEntity {
  constructor(readonly id: number | string, readonly name: string) {}
}

class TestAssembler implements BaseAssembler<TestEntity, TestResponse> {
  toEntityFromResource(resource: TestResponse): TestEntity {
    return new TestEntity(resource.id, resource.name);
  }

  toEntitiesFromResponse(response: TestResponse[]): TestEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: TestEntity): TestResponse {
    return { id: entity.id, name: entity.name };
  }
}

class TestEndpoint extends BaseApiEndpoint<TestEntity, TestResponse, TestAssembler> {
  constructor(http: HttpClient) {
    super(http, '/test', new TestAssembler());
  }
}

describe('BaseApiEndpoint deferred writes', () => {
  it('returns a pending-operation error without sending resource mutations', () => {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'put', 'delete']);
    const endpoint = new TestEndpoint(http);
    const entity = new TestEntity(1, 'example');
    const messages: string[] = [];

    endpoint.create(entity).subscribe({ error: (error: Error) => messages.push(error.message) });
    endpoint.update(1, entity).subscribe({ error: (error: Error) => messages.push(error.message) });
    endpoint.delete(1).subscribe({ error: (error: Error) => messages.push(error.message) });

    expect(messages).toEqual(Array(3).fill('shared.errors.resourceWritePending'));
    expect(http.post).not.toHaveBeenCalled();
    expect(http.put).not.toHaveBeenCalled();
    expect(http.delete).not.toHaveBeenCalled();
  });
});
