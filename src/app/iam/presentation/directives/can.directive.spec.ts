import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';

import { CanDirective } from './can.directive';
import { IamStore } from '../../application/iam.store';

@Component({
  imports: [CanDirective],
  template: `
    <button id="entry" *nsCan="'inventory.entry.create'">Register entry</button>
    <button id="admin" *nsCan="['warehouses.update', 'warehouses.delete']">Edit warehouse</button>
  `
})
class HostComponent {
}

describe('CanDirective', () => {
  const permissions = signal<string[]>([]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: IamStore,
          useValue: { hasAnyPermission: (codes: readonly string[]) => codes.some((code) => permissions().includes(code)) }
        }
      ]
    });
  });

  it('renders only the actions allowed by the permissions and reacts to changes', async () => {
    permissions.set(['inventory.entry.create']);
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('#entry')).not.toBeNull();
    expect(element.querySelector('#admin')).toBeNull();

    permissions.set(['warehouses.delete']);
    await fixture.whenStable();

    expect(element.querySelector('#entry')).toBeNull();
    expect(element.querySelector('#admin')).not.toBeNull();
  });
});
