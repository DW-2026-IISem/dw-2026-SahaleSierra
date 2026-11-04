import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { Role, RolePayload } from '../../../../core/models/role.model';

@Component({
  host: { class: 'block' },
  selector: 'app-role-form',
  imports: [ButtonModule, InputTextModule, MessageModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  readonly role = input<Role | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<RolePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: [''],
  });

  constructor() {
    effect(() => {
      const current = this.role();
      this.resetKey();
      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: RolePayload = {
      name: value.name.trim().toUpperCase(),
      description: value.description.trim() || null,
    };
    if (!this.role()) {
      payload.status = 'active';
    }
    this.saved.emit(payload);
  }
}
