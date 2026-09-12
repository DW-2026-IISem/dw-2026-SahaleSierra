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
import { CreateDoctorDto } from '../../../application/dto/create-doctor.dto.js';
import { UpdateDoctorDto } from '../../../application/dto/update-doctor.dto.js';
import { DoctorFilterDto } from '../../../application/dto/doctor-filter.dto.js';
import { CreateDoctorUseCase } from '../../../application/use-cases/create-doctor.use-case.js';
import { DeleteDoctorUseCase } from '../../../application/use-cases/delete-doctor.use-case.js';
import { GetDoctorUseCase } from '../../../application/use-cases/get-doctor.use-case.js';
import { ListDoctorsUseCase } from '../../../application/use-cases/list-doctors.use-case.js';
import { UpdateDoctorUseCase } from '../../../application/use-cases/update-doctor.use-case.js';
import { DoctorSerializer } from '../serializers/doctor.serializer.js';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly createDoctor: CreateDoctorUseCase,
    private readonly deleteDoctor: DeleteDoctorUseCase,
    private readonly getDoctor: GetDoctorUseCase,
    private readonly listDoctors: ListDoctorsUseCase,
    private readonly updateDoctor: UpdateDoctorUseCase,
  ) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateDoctorDto) {
    return DoctorSerializer.one(await this.createDoctor.execute(dto));
  }

  @Get()
  async list(@Query() filter: DoctorFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listDoctors.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: DoctorSerializer.many(result.data), total: result.total };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return DoctorSerializer.one(await this.getDoctor.execute(id));
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDoctorDto) {
    return DoctorSerializer.one(await this.updateDoctor.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteDoctor.execute(id);
    return { deleted: true };
  }
}
