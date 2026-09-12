import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialtyDto } from './create-specialty.dto.js';

export class UpdateSpecialtyDto extends PartialType(CreateSpecialtyDto) {}
