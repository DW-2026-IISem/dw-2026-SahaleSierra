import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAuthorizationDto } from './create-authorization.dto.js';

export class UpdateAuthorizationDto extends PartialType(
  OmitType(CreateAuthorizationDto, ['appointmentId'] as const),
) {}
