import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { IamStore } from '../../application/iam.store';

/**
 * Renders its template only when the signed-in user holds ANY of the given permission codes.
 *
 *   <button *nsCan="'inventory.entry.create'">...</button>
 *   <a *nsCan="['inventory.view', 'inventory.products.view']">...</a>
 *
 * Hiding an option is not a security measure: the API rejects the operation anyway.
 */
@Directive({
  selector: '[nsCan]',
  standalone: true
})
export class CanDirective {
  private readonly iamStore = inject(IamStore);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private rendered = false;

  readonly nsCan = input.required<string | readonly string[]>();

  constructor() {
    effect(() => {
      const value = this.nsCan();
      const codes = typeof value === 'string' ? [value] : value;
      const allowed = this.iamStore.hasAnyPermission(codes);
      if (allowed && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }
}
