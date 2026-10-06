import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

import { IamStore } from '../../../application/iam.store';

/** Sign-In form (user story US13). */
@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignIn {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly iamStore = inject(IamStore);

  protected readonly requireCredentials = environment.requireCredentials;

  private readonly usernameValidators: ValidatorFn[] = this.requireCredentials
    ? [Validators.required]
    : [];

  private readonly passwordValidators: ValidatorFn[] = this.requireCredentials
    ? [Validators.required, Validators.minLength(8)]
    : [];

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', this.usernameValidators],
    password: ['', this.passwordValidators]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    void this.iamStore.signIn(this.form.getRawValue());
  }
}
