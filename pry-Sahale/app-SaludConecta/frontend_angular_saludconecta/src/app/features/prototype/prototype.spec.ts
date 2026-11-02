import { TestBed } from '@angular/core/testing';
import { Prototype } from './prototype';

/**
 * jsdom no implementa `matchMedia`, así que `watchMediaQuery` devuelve `false`
 * y el componente se comporta como móvil. El caso de escritorio se prueba aquí
 * sustituyendo la función antes de crear el componente.
 */
function stubDesktopMedia(matches: boolean): () => void {
  const original = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  });

  return () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: original,
    });
  };
}

type PrototypeState = {
  mobileOpen: () => boolean;
  sidebarCollapsed: () => boolean;
};

describe('Prototype', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prototype],
    }).compileComponents();
  });

  async function renderScreen() {
    const fixture = TestBed.createComponent(Prototype);
    await fixture.whenStable();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }

  function menuButton(compiled: HTMLElement): HTMLButtonElement {
    const button = compiled.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    );
    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }

  function menuOption(compiled: HTMLElement, label: string): HTMLElement {
    const option = [...compiled.querySelectorAll('a, button')].find(
      (element) => element.textContent?.trim() === label,
    );
    expect(option).toBeTruthy();
    return option as HTMLElement;
  }

  it('should compose the layout and start on Inicio', async () => {
    const { compiled } = await renderScreen();

    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    expect(compiled.querySelector('main h1')?.textContent).toContain('Inicio');
  });

  it('should render the five menu options', async () => {
    const { compiled } = await renderScreen();
    const text = compiled.textContent ?? '';

    for (const label of ['Inicio', 'Pacientes', 'Citas', 'Atenciones', 'Facturas']) {
      expect(text).toContain(label);
    }
  });

  it('should always show the menu button, not only on small screens', async () => {
    const { compiled } = await renderScreen();

    // `lg:hidden` ocultaba el botón justo cuando el Aside ya era visible.
    expect(menuButton(compiled).classList.contains('lg:hidden')).toBe(false);
  });

  it('should change the title without navigating when an option is chosen', async () => {
    const { fixture, compiled } = await renderScreen();

    menuOption(compiled, 'Pacientes').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('main h1')?.textContent).toContain('Pacientes');
  });

  it('should open the mobile drawer when the header requests it', async () => {
    const { fixture, compiled } = await renderScreen();
    const component = fixture.componentInstance as unknown as PrototypeState;

    expect(component.mobileOpen()).toBe(false);

    menuButton(compiled).click();
    fixture.detectChanges();
    await fixture.whenStable();

    // El Drawer se monta en un overlay: se verifica el estado, no el DOM.
    expect(component.mobileOpen()).toBe(true);
  });

  it('should close the drawer when an option is chosen', async () => {
    const { fixture, compiled } = await renderScreen();
    const component = fixture.componentInstance as unknown as PrototypeState;

    menuButton(compiled).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.mobileOpen()).toBe(true);

    menuOption(compiled, 'Citas').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.mobileOpen()).toBe(false);
    expect(compiled.querySelector('main h1')?.textContent).toContain('Citas');
  });

  it('should toggle the fixed aside on desktop instead of opening the drawer', async () => {
    const restore = stubDesktopMedia(true);
    try {
      const { fixture, compiled } = await renderScreen();
      const component = fixture.componentInstance as unknown as PrototypeState;

      expect(compiled.querySelector('aside app-aside')).toBeTruthy();

      menuButton(compiled).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.sidebarCollapsed()).toBe(true);
      expect(component.mobileOpen()).toBe(false);
      expect(compiled.querySelector('aside app-aside')).toBeNull();

      menuButton(compiled).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.sidebarCollapsed()).toBe(false);
      expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    } finally {
      restore();
    }
  });
});
