import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  async function renderApp() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compose the three layout regions', async () => {
    const compiled = await renderApp();
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render the application name in the header', async () => {
    const compiled = await renderApp();
    const header = compiled.querySelector('app-header') as HTMLElement;
    expect(header.textContent).toContain('SaludConecta');
  });

  it('should render the initial title in the content', async () => {
    const compiled = await renderApp();
    const main = compiled.querySelector('main') as HTMLElement;
    expect(main.textContent).toContain('Inicio');
    expect(main.textContent).toContain('Bienvenido a SaludConecta.');
  });
});
