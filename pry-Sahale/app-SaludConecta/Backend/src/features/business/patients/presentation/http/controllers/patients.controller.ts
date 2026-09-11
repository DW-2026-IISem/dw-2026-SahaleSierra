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
import { CreatePatientDto } from '../../../application/dto/create-patient.dto.js';
import { UpdatePatientDto } from '../../../application/dto/update-patient.dto.js';
import { PatientFilterDto } from '../../../application/dto/patient-filter.dto.js';
import { CreatePatientUseCase } from '../../../application/use-cases/create-patient.use-case.js';
import { DeletePatientUseCase } from '../../../application/use-cases/delete-patient.use-case.js';
import { GetPatientUseCase } from '../../../application/use-cases/get-patient.use-case.js';
import { ListPatientsUseCase } from '../../../application/use-cases/list-patients.use-case.js';
import { UpdatePatientUseCase } from '../../../application/use-cases/update-patient.use-case.js';
import { PatientSerializer } from '../serializers/patient.serializer.js';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly createPatient: CreatePatientUseCase,
    private readonly deletePatient: DeletePatientUseCase,
    private readonly getPatient: GetPatientUseCase,
    private readonly listPatients: ListPatientsUseCase,
    private readonly updatePatient: UpdatePatientUseCase,
  ) {}

  @Roles('ADMIN', 'ADMISIONES')
  @Post()
  async create(@Body() dto: CreatePatientDto) {
    const patient = await this.createPatient.execute(dto);
    return PatientSerializer.one(patient);
  }

  @Roles('ADMIN', 'ADMISIONES', 'MEDICO')
  @Get()
  async list(@Query() filter: PatientFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listPatients.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: PatientSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'ADMISIONES', 'MEDICO')
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.getPatient.execute(id);
    return PatientSerializer.one(patient);
  }

  @Roles('ADMIN', 'ADMISIONES')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto) {
    const patient = await this.updatePatient.execute(id, dto);
    return PatientSerializer.one(patient);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deletePatient.execute(id);
    return { deleted: true };
  }
}
