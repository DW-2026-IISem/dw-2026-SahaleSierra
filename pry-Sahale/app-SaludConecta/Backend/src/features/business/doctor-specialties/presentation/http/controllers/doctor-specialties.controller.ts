import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../../../../common/decorators/roles.decorator.js';
import { CreateDoctorSpecialtyDto } from '../../../application/dto/create-doctor-specialty.dto.js';
import { DoctorSpecialtyFilterDto } from '../../../application/dto/doctor-specialty-filter.dto.js';
import { CreateDoctorSpecialtyUseCase } from '../../../application/use-cases/create-doctor-specialty.use-case.js';
import { DeleteDoctorSpecialtyUseCase } from '../../../application/use-cases/delete-doctor-specialty.use-case.js';
import { ListDoctorSpecialtiesUseCase } from '../../../application/use-cases/list-doctor-specialties.use-case.js';
import { DoctorSpecialtySerializer } from '../serializers/doctor-specialty.serializer.js';

@ApiTags('doctor-specialties')
@Controller('doctor-specialties')
export class DoctorSpecialtiesController {
  constructor(
    private readonly createDoctorSpecialty: CreateDoctorSpecialtyUseCase,
    private readonly deleteDoctorSpecialty: DeleteDoctorSpecialtyUseCase,
    private readonly listDoctorSpecialties: ListDoctorSpecialtiesUseCase,
  ) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateDoctorSpecialtyDto) {
    return DoctorSpecialtySerializer.one(await this.createDoctorSpecialty.execute(dto));
  }

  @Get()
  async list(@Query() filter: DoctorSpecialtyFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listDoctorSpecialties.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: DoctorSpecialtySerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteDoctorSpecialty.execute(id);
    return { deleted: true };
  }
}
