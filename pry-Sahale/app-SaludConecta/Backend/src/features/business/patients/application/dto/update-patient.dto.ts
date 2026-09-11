import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto.js';

export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['documentNumber'] as const),
) {}
