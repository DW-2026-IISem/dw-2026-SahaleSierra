import { TestBed } from '@angular/core/testing';
import { StateTag } from './state-tag';

describe('StateTag', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StateTag] }).compileComponents();
  });

  async function render(state: string) {
    const fixture = TestBed.createComponent(StateTag);
    fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return fixture;
  }

  it('should show a scheduled appointment as Programada with info severity', async () => {
    const fixture = await render('scheduled');

    expect(fixture.componentInstance.label()).toBe('Programada');
    expect(fixture.componentInstance.severity()).toBe('info');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Programada');
  });

  it('should show an attended appointment as Atendida with success severity', async () => {
    const fixture = await render('attended');

    expect(fixture.componentInstance.label()).toBe('Atendida');
    expect(fixture.componentInstance.severity()).toBe('success');
  });

  it('should show a cancelled appointment as Cancelada with danger severity', async () => {
    const fixture = await render('cancelled');

    expect(fixture.componentInstance.label()).toBe('Cancelada');
    expect(fixture.componentInstance.severity()).toBe('danger');
  });

  it('should show an unknown state as plain text with secondary severity', async () => {
    const fixture = await render('archived');

    expect(fixture.componentInstance.label()).toBe('archived');
    expect(fixture.componentInstance.severity()).toBe('secondary');
  });
});
