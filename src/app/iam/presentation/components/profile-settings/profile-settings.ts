import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';

/** Same rules as the backend value objects (Username, EmailAddress, Password). */
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const value = group.value as { newPassword: string; confirmPassword: string };
  return value.newPassword === value.confirmPassword ? null : { mismatch: true };
}

/** Settings > Profile: full name, email, username and password of the signed-in user. */
@Component({
  selector: 'app-profile-settings',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSettings implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly iamStore = inject(IamStore);

  protected readonly profileForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.pattern(USERNAME_PATTERN)]]
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatch });

  protected readonly profileState = signal<'idle' | 'saving' | 'saved'>('idle');
  protected readonly profileError = signal<string | null>(null);
  protected readonly passwordState = signal<'idle' | 'saving' | 'saved'>('idle');
  protected readonly passwordError = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.iamStore.currentUser();
    this.profileForm.reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      username: user?.username ?? ''
    });
  }

  protected async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileState.set('saving');
    this.profileError.set(null);
    try {
      await this.iamStore.updateProfile(this.profileForm.getRawValue());
      this.profileState.set('saved');
    } catch (error: unknown) {
      this.profileState.set('idle');
      this.profileError.set(this.errorKey(error, 'settings.profile.taken'));
    }
  }

  protected async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.passwordState.set('saving');
    this.passwordError.set(null);
    try {
      await this.iamStore.changePassword(currentPassword, newPassword);
      this.passwordForm.reset();
      this.passwordState.set('saved');
    } catch (error: unknown) {
      this.passwordState.set('idle');
      this.passwordError.set(this.errorKey(error, 'settings.password.currentInvalid'));
    }
  }

  /** 400/409 come from the business rules; 0 and 5xx are connection or server problems. */
  private errorKey(error: unknown, businessKey: string): string {
    const status = error instanceof HttpErrorResponse ? error.status : -1;
    if (status === 400 || status === 409) {
      return businessKey;
    }
    if (status === 0) {
      return 'shared.http.unreachable';
    }
    return 'shared.http.serverError';
  }
}
