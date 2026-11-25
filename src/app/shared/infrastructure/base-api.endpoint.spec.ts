import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
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

describe('BaseApiEndpoint writes', () => {
  it('sends POST, PUT and DELETE requests to the resource endpoint', () => {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'put', 'delete']);
    http.post.and.returnValue(of({ id: 1, name: 'example' }));
    http.put.and.returnValue(of({ id: 1, name: 'example' }));
    http.delete.and.returnValue(of(undefined));
    const endpoint = new TestEndpoint(http);
    const entity = new TestEntity(1, 'example');

    endpoint.create(entity).subscribe();
    endpoint.update(1, entity).subscribe();
    endpoint.delete(1).subscribe();

    expect(http.post).toHaveBeenCalledWith('/test', { id: 1, name: 'example' });
    expect(http.put).toHaveBeenCalledWith('/test/1', { id: 1, name: 'example' });
    expect(http.delete).toHaveBeenCalledWith('/test/1');
  });
});
