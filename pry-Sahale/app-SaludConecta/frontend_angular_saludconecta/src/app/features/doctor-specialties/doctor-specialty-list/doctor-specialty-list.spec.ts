import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorSpecialty } from '../../../core/models/doctor-specialty.model';
import { Specialty } from '../../../core/models/specialty.model';
import { DoctorSpecialtyList } from './doctor-specialty-list';

const LINKS_URL = `${environment.apiUrl}/doctor-specialties`;
const DOCTORS_URL = `${environment.apiUrl}/doctors`;
const SPECIALTIES_URL = `${environment.apiUrl}/specialties`;

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Camila Torres', description: null, status: 'active' },
  { id: 2, name: 'Dr. Andrés Ramírez', description: null, status: 'active' },
];

const SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Pediatría', description: null, status: 'active' },
  { id: 2, name: 'Cardiología', description: null, status: 'active' },
];

const LINKS: DoctorSpecialty[] = [
  { id: 1, doctor_id: 1, specialty_id: 1, status: 'active' },
  { id: 2, doctor_id: 1, specialty_id: 2, status: 'active' },
  { id: 3, doctor_id: 2, specialty_id: 2, status: 'active' },
];

describe('DoctorSpecialtyList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSpecialtyList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
    messages = TestBed.inject(MessageService);
  });

  afterEach(() => http.verify());

  /** Responde los tres `GET` que lanza `load()`. */
  function flushLoad(
    links: DoctorSpecialty[] = LINKS,
    doctors: Doctor[] = DOCTORS,
    specialties: Specialty[] = SPECIALTIES,
  ): void {
    http.expectOne(LINKS_URL).flush({ doctor_specialties: links });
    http.expectOne(DOCTORS_URL).flush({ doctors });
    http.expectOne(SPECIALTIES_URL).flush({ specialties });
  }

  /** Crea la pantalla y responde la carga inicial. */
  async function createList(
    links: DoctorSpecialty[] = LINKS,
    doctors: Doctor[] = DOCTORS,
  ) {
    const fixture = TestBed.createComponent(DoctorSpecialtyList);
    flushLoad(links, doctors);
    fixture.detectChanges();
    await fixture.whenStable();
    return {
      fixture,
      list: fixture.componentInstance,
      compiled: fixture.nativeElement as HTMLElement,
    };
  }

  /** Espía que acepta la confirmación de inmediato. `confirm` devuelve el servicio. */
  function acceptConfirmation(): void {
    vi.spyOn(confirmation, 'confirm').mockImplementation((options) => {
      options.accept?.();
      return confirmation;
    });
  }

  it('should load the links, doctors and specialties in parallel on start', async () => {
    const { list } = await createList();

    expect(list.rows()).toEqual(LINKS);
    expect(list.doctors()).toEqual(DOCTORS);
    expect(list.specialties()).toEqual(SPECIALTIES);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });

  it('should resolve ids to names and fall back to the id when the doctor is not active', async () => {
    const { list } = await createList(
      [...LINKS, { id: 4, doctor_id: 9, specialty_id: 1, status: 'active' }],
    );

    expect(list.doctorName()(1)).toBe('Dra. Camila Torres');
    expect(list.specialtyName()(2)).toBe('Cardiología');
    expect(list.doctorName()(9)).toBe('Médico #9');
    expect(list.specialtyName()(99)).toBe('Especialidad #99');
  });

  it('should show the backend error and an empty table when a load fails', async () => {
    const fixture = TestBed.createComponent(DoctorSpecialtyList);
    http
      .expectOne(LINKS_URL)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    // forkJoin cancela las otras dos peticiones al fallar la primera.
    http.expectOne(DOCTORS_URL);
    http.expectOne(SPECIALTIES_URL);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should filter by doctor or specialty name without calling the backend again', async () => {
    const { fixture, list } = await createList();

    list.filter.set('pediatr');
    fixture.detectChanges();
    expect(list.visibleRows().map((row) => row.id)).toEqual([1]);

    list.filter.set('andrés');
    fixture.detectChanges();
    expect(list.visibleRows().map((row) => row.id)).toEqual([3]);

    http.expectNone(LINKS_URL);
  });

  it('should render one table row per link with the names, not the ids', async () => {
    const { compiled } = await createList();

    // Si la tabla usara `pTemplate` en lugar de `#body`, saldría vacía sin error.
    expect(compiled.querySelectorAll('tbody tr').length).toBe(LINKS.length);
    expect(compiled.textContent).toContain('Dra. Camila Torres');
    expect(compiled.textContent).toContain('Cardiología');
  });

  it('should POST the pair and reload the three sources', async () => {
    const { list } = await createList();

    list.openCreate();
    list.save({ doctor_id: 2, specialty_id: 1 });

    const creation = http.expectOne(LINKS_URL);
    expect(creation.request.method).toBe('POST');
    expect(creation.request.body).toEqual({ doctor_id: 2, specialty_id: 1 });
    creation.flush({ doctor_specialty: { id: 4, doctor_id: 2, specialty_id: 1, status: 'active' } });

    expect(list.dialogVisible()).toBe(false);
    flushLoad([...LINKS, { id: 4, doctor_id: 2, specialty_id: 1, status: 'active' }]);
    expect(list.rows().length).toBe(4);
  });

  it('should keep the dialog open and show the backend message when the pair is repeated', async () => {
    const { list } = await createList();
    const add = vi.spyOn(messages, 'add');

    list.openCreate();
    list.save({ doctor_id: 1, specialty_id: 1 });
    http
      .expectOne(LINKS_URL)
      .flush(
        { error: 'Doctor already has this specialty (id 1)' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: 'Doctor already has this specialty (id 1)',
      }),
    );
    expect(list.dialogVisible()).toBe(true);
    expect(list.saving()).toBe(false);
    // No se recarga: nada cambió en el backend.
    expect(list.rows().length).toBe(3);
  });

  it('should call deactivate after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.deactivate(LINKS[0]);

    const deactivation = http.expectOne(`${LINKS_URL}/1/deactivate`);
    expect(deactivation.request.method).toBe('PATCH');
    deactivation.flush({ message: 'Doctor specialty deactivated (logical delete)' });
    flushLoad(LINKS.slice(1));

    expect(list.rows().map((row) => row.id)).toEqual([2, 3]);
  });

  it('should call DELETE after the confirmation is accepted and reload', async () => {
    const { list } = await createList();
    acceptConfirmation();

    list.remove(LINKS[2]);

    const deletion = http.expectOne(`${LINKS_URL}/3`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({ message: 'Doctor specialty permanently deleted', id: 3 });
    flushLoad(LINKS.slice(0, 2));

    expect(list.rows().length).toBe(2);
  });
});
