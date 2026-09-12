import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../../../../common/decorators/roles.decorator.js';
import { CreateClinicalRecordDto } from '../../../application/dto/create-clinical-record.dto.js';
import { UpdateClinicalRecordDto } from '../../../application/dto/update-clinical-record.dto.js';
import { ClinicalRecordFilterDto } from '../../../application/dto/clinical-record-filter.dto.js';
import { CreateClinicalRecordUseCase } from '../../../application/use-cases/create-clinical-record.use-case.js';
import { DeleteClinicalRecordUseCase } from '../../../application/use-cases/delete-clinical-record.use-case.js';
import { GetClinicalRecordUseCase } from '../../../application/use-cases/get-clinical-record.use-case.js';
import { GetClinicalRecordByPatientUseCase } from '../../../application/use-cases/get-clinical-record-by-patient.use-case.js';
import { ListClinicalRecordsUseCase } from '../../../application/use-cases/list-clinical-records.use-case.js';
import { UpdateClinicalRecordUseCase } from '../../../application/use-cases/update-clinical-record.use-case.js';
import { ClinicalRecordSerializer } from '../serializers/clinical-record.serializer.js';

@ApiTags('clinical-records')
@Controller()
export class ClinicalRecordsController {
  constructor(
    private readonly createClinicalRecord: CreateClinicalRecordUseCase,
    private readonly deleteClinicalRecord: DeleteClinicalRecordUseCase,
    private readonly getClinicalRecord: GetClinicalRecordUseCase,
    private readonly getClinicalRecordByPatient: GetClinicalRecordByPatientUseCase,
    private readonly listClinicalRecords: ListClinicalRecordsUseCase,
    private readonly updateClinicalRecord: UpdateClinicalRecordUseCase,
  ) {}

  @Roles('ADMIN', 'MEDICO')
  @Post('clinical-records')
  async create(@Body() dto: CreateClinicalRecordDto) {
    return ClinicalRecordSerializer.one(await this.createClinicalRecord.execute(dto));
  }

  @Roles('ADMIN', 'MEDICO', 'AUDITOR_CLINICO')
  @Get('clinical-records')
  async list(@Query() filter: ClinicalRecordFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listClinicalRecords.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: ClinicalRecordSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'MEDICO', 'AUDITOR_CLINICO')
  @Get('clinical-records/:id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ClinicalRecordSerializer.one(await this.getClinicalRecord.execute(id));
  }

  @Roles('ADMIN', 'MEDICO', 'AUDITOR_CLINICO')
  @Get('historias/:pacienteId')
  async getByPatient(@Param('pacienteId', ParseIntPipe) pacienteId: number) {
    return ClinicalRecordSerializer.one(await this.getClinicalRecordByPatient.execute(pacienteId));
  }

  @Roles('ADMIN', 'MEDICO')
  @Patch('clinical-records/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClinicalRecordDto) {
    return ClinicalRecordSerializer.one(await this.updateClinicalRecord.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete('clinical-records/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteClinicalRecord.execute(id);
    return { deleted: true };
  }
}
