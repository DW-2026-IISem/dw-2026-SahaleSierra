import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClinicalRecordDto } from './create-clinical-record.dto.js';

export class UpdateClinicalRecordDto extends PartialType(
  OmitType(CreateClinicalRecordDto, ['patientId'] as const),
) {}
