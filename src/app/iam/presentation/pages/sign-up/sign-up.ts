import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import {
  LanguageSwitcher
} from '../../../../shared/presentation/components/language-switcher/language-switcher'


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    LanguageSwitcher
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly iamStore = inject(IamStore);
  protected readonly selectedPlanCode = signal<string | null>(null);

  /**
   * Public sign-up always creates a NEW organization whose owner is the person registering.
   * Workers do not use this form: the owner creates their accounts from "Team & Access".
   * Rules mirror the API validation (username 3-30 lowercase chars, password 8-72).
   */
  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    organizationName: ['', [Validators.required, Validators.maxLength(120)]],
    username: ['', [Validators.required, Validators.pattern(/^[a-z0-9._-]{3,30}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]]
  });

  ngOnInit(): void {
    this.selectedPlanCode.set(this.route.snapshot.queryParamMap.get('plan'));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    void this.iamStore.signUp({
      fullName: value.fullName.trim(),
      organizationName: value.organizationName.trim(),
      username: value.username.trim().toLowerCase(),
      email: value.email.trim(),
      password: value.password,
      planCode: this.selectedPlanCode()
    });
  }
}
