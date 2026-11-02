import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Shell } from './shell';

describe('Shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      // `<router-outlet />` necesita el router; `<p-toast />` y `<p-confirmdialog />`
      // consumen MessageService y ConfirmationService.
      providers: [provideRouter([]), MessageService, ConfirmationService],
    }).compileComponents();
  });

  async function renderShell() {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }

  it('should compose header, aside, main, footer and the router outlet', async () => {
    const { compiled } = await renderShell();

    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    expect(compiled.querySelector('main#contenido router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should open the mobile drawer from the header button', async () => {
    const { fixture, compiled } = await renderShell();

    const button = compiled.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.mobileOpen()).toBe(true);
  });
});
