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
import { CreateSpecialtyDto } from '../../../application/dto/create-specialty.dto.js';
import { UpdateSpecialtyDto } from '../../../application/dto/update-specialty.dto.js';
import { SpecialtyFilterDto } from '../../../application/dto/specialty-filter.dto.js';
import { CreateSpecialtyUseCase } from '../../../application/use-cases/create-specialty.use-case.js';
import { DeleteSpecialtyUseCase } from '../../../application/use-cases/delete-specialty.use-case.js';
import { GetSpecialtyUseCase } from '../../../application/use-cases/get-specialty.use-case.js';
import { ListSpecialtiesUseCase } from '../../../application/use-cases/list-specialties.use-case.js';
import { UpdateSpecialtyUseCase } from '../../../application/use-cases/update-specialty.use-case.js';
import { SpecialtySerializer } from '../serializers/specialty.serializer.js';

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private readonly createSpecialty: CreateSpecialtyUseCase,
    private readonly deleteSpecialty: DeleteSpecialtyUseCase,
    private readonly getSpecialty: GetSpecialtyUseCase,
    private readonly listSpecialties: ListSpecialtiesUseCase,
    private readonly updateSpecialty: UpdateSpecialtyUseCase,
  ) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateSpecialtyDto) {
    return SpecialtySerializer.one(await this.createSpecialty.execute(dto));
  }

  @Get()
  async list(@Query() filter: SpecialtyFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listSpecialties.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: SpecialtySerializer.many(result.data), total: result.total };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return SpecialtySerializer.one(await this.getSpecialty.execute(id));
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpecialtyDto) {
    return SpecialtySerializer.one(await this.updateSpecialty.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteSpecialty.execute(id);
    return { deleted: true };
  }
}
