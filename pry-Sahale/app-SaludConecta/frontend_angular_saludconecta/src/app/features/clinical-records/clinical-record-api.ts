import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClinicalRecord,
  ClinicalRecordPayload,
  ClinicalRecordUpdatePayload,
} from '../../core/models/clinical-record.model';

/** Historias clínicas: una por paciente (`patient_id` único y fijo). */
@Injectable({ providedIn: 'root' })
export class ClinicalRecordApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clinical-records`;

  list(): Observable<ClinicalRecord[]> {
    return this.http
      .get<{ clinical_records: ClinicalRecord[] }>(this.base)
      .pipe(map((response) => response.clinical_records));
  }

  get(id: number): Observable<ClinicalRecord> {
    return this.http
      .get<{ clinical_record: ClinicalRecord }>(`${this.base}/${id}`)
      .pipe(map((response) => response.clinical_record));
  }

  /** Ruta extra: 404 `Clinical record not found for this patient` si no tiene. */
  getByPatient(patientId: number): Observable<ClinicalRecord> {
    return this.http
      .get<{ clinical_record: ClinicalRecord }>(`${this.base}/patient/${patientId}`)
      .pipe(map((response) => response.clinical_record));
  }

  create(payload: ClinicalRecordPayload): Observable<ClinicalRecord> {
    return this.http
      .post<{ clinical_record: ClinicalRecord }>(this.base, payload)
      .pipe(map((response) => response.clinical_record));
  }

  update(id: number, payload: ClinicalRecordUpdatePayload): Observable<ClinicalRecord> {
    return this.http
      .patch<{ clinical_record: ClinicalRecord }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.clinical_record));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
