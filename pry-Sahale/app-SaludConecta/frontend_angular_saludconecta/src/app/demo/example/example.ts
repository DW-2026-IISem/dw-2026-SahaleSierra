import { Component, computed, effect, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

/**
 * Objeto de demostración. No es una entidad del backend: el servicio real
 * (`Service`) no tiene precio, el valor se registra en cada atención.
 */
export interface DemoService {
  name: string;
  price: number;
  active: boolean;
}

/**
 * Componente de aprendizaje de ISS-01 (`<app-example />`).
 *
 * Explica con un objeto dentro de un `signal`: estado, derivados (`computed`),
 * efecto (`effect`) y los cuatro eventos de la plantilla. No entra en el menú,
 * no tiene ruta y no se usa en ningún ISS posterior.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-example',
  imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],
  templateUrl: './example.html',
  styleUrl: './example.css',
})
export class Example {
  // ESTADO: el signal guarda un objeto completo.
  protected readonly service = signal<DemoService>(initialService());

  // DERIVADOS: se calculan desde `service()`, nunca se asignan.
  protected readonly finalPrice = computed(() =>
    Math.round(this.service().price * 1.19),
  );
  protected readonly statusText = computed(() =>
    this.service().active ? 'Activo' : 'Inactivo',
  );

  // EFECTO: se ejecuta al crear y en cada cambio del objeto.
  private readonly log = effect(() => {
    const { name, price, active } = this.service();
    console.log(`[example] ${name} · precio ${price} · ${active ? 'activo' : 'inactivo'}`);
  });

  // Métodos que la plantilla llama desde los eventos.
  protected changeName(event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    this.service.update((current) => ({ ...current, name }));
  }

  protected changePrice(delta: number): void {
    this.service.update((current) => ({
      ...current,
      price: Math.max(0, current.price + delta),
    }));
  }

  protected toggleStatus(): void {
    this.service.update((current) => ({ ...current, active: !current.active }));
  }

  protected reset(): void {
    this.service.set(initialService());
  }
}

/** Función auxiliar: evita compartir el mismo objeto entre el estado inicial y el reinicio. */
function initialService(): DemoService {
  return { name: 'Holter 24 horas', price: 180000, active: true };
}
