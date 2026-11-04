import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import {
  HTTP_METHODS,
  HttpMethod,
  Resource,
  ResourcePayload,
} from '../../../../core/models/resource.model';

/** El path debe empezar por `/`. */
function startsWithSlash(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && !control.value.startsWith('/') ? { slash: true } : null;
}

@Component({
  host: { class: 'block' },
  selector: 'app-resource-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  readonly resource = input<Resource | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<ResourcePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly methodOptions = HTTP_METHODS.map((method) => ({ label: method, value: method }));

  readonly form = this.fb.group({
    method: ['GET' as HttpMethod, [Validators.required]],
    path: ['', [Validators.required, startsWithSlash]],
    description: [''],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      this.resetKey();
      this.form.reset({
        method: current?.method ?? 'GET',
        path: current?.path ?? '',
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
    const payload: ResourcePayload = {
      method: value.method,
      path: value.path.trim(),
      description: value.description.trim() || null,
    };
    if (!this.resource()) {
      payload.status = 'active';
    }
    this.saved.emit(payload);
  }
}
