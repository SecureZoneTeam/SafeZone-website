import { Injectable, inject, signal } from '@angular/core';

import { Company } from '../domain/model/company.entity';
import { CompaniesApiEndpoint } from '../infrastructure/companies-api.endpoint';

/** Application state management for the Company Registration bounded context. */
@Injectable({ providedIn: 'root' })
export class CompanyStore {
  private readonly companiesApi = inject(CompaniesApiEndpoint);

  private readonly companiesSignal = signal<Company[]>([]);
  private readonly errorSignal = signal<string | null>(null);

  readonly companies = this.companiesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadCompanies(): void {
    this.companiesApi.getAll().subscribe({
      next: (companies) => this.companiesSignal.set(companies),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }

  registerCompany(company: Company): void {
    this.companiesApi.create(company).subscribe({
      next: (created) => this.companiesSignal.update((current) => [...current, created]),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }
}
