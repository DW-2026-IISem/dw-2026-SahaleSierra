import { TestBed } from '@angular/core/testing';
import { Example } from './example';

describe('Example', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Example] }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(Example);
    await fixture.whenStable();
    return fixture;
  }

  function button(root: HTMLElement, label: string): HTMLButtonElement {
    const found = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(label),
    );
    if (!found) throw new Error(`Botón no encontrado: ${label}`);
    return found as HTMLButtonElement;
  }

  it('should show the initial service and its price with tax', async () => {
    const fixture = await render();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Holter 24 horas');
    expect(root.textContent).toContain('180000');
    expect(root.textContent).toContain('214200');
    expect(root.textContent).toContain('Activo');
  });

  it('should add 1000 to the price and recompute the price with tax', async () => {
    const fixture = await render();
    const root = fixture.nativeElement as HTMLElement;
    button(root, '+1000').click();
    await fixture.whenStable();
    expect(root.textContent).toContain('181000');
    expect(root.textContent).toContain('215390');
  });

  it('should update the preview when the name changes', async () => {
    const fixture = await render();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    input.value = 'Electrocardiograma';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(root.textContent).toContain('Vista previa: Electrocardiograma');
  });

  it('should toggle the status and show the logical delete notice', async () => {
    const fixture = await render();
    const root = fixture.nativeElement as HTMLElement;
    button(root, 'Cambiar estado').click();
    await fixture.whenStable();
    expect(root.textContent).toContain('Inactivo');
    expect(root.textContent).toContain('el borrado lógico lo oculta de las listas');
  });
});
