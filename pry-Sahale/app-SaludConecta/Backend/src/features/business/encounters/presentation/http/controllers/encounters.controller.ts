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
import { CreateEncounterDto } from '../../../application/dto/create-encounter.dto.js';
import { UpdateEncounterDto } from '../../../application/dto/update-encounter.dto.js';
import { EncounterFilterDto } from '../../../application/dto/encounter-filter.dto.js';
import { CreateEncounterUseCase } from '../../../application/use-cases/create-encounter.use-case.js';
import { DeleteEncounterUseCase } from '../../../application/use-cases/delete-encounter.use-case.js';
import { GetEncounterUseCase } from '../../../application/use-cases/get-encounter.use-case.js';
import { ListEncountersUseCase } from '../../../application/use-cases/list-encounters.use-case.js';
import { UpdateEncounterUseCase } from '../../../application/use-cases/update-encounter.use-case.js';
import { EncounterSerializer } from '../serializers/encounter.serializer.js';

@ApiTags('encounters')
@Controller('encounters')
export class EncountersController {
  constructor(
    private readonly createEncounter: CreateEncounterUseCase,
    private readonly deleteEncounter: DeleteEncounterUseCase,
    private readonly getEncounter: GetEncounterUseCase,
    private readonly listEncounters: ListEncountersUseCase,
    private readonly updateEncounter: UpdateEncounterUseCase,
  ) {}

  @Roles('ADMIN', 'MEDICO')
  @Post()
  async create(@Body() dto: CreateEncounterDto) {
    return EncounterSerializer.one(await this.createEncounter.execute(dto));
  }

  @Roles('ADMIN', 'MEDICO', 'AUDITOR_CLINICO', 'FACTURACION')
  @Get()
  async list(@Query() filter: EncounterFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listEncounters.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: EncounterSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'MEDICO', 'AUDITOR_CLINICO', 'FACTURACION')
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return EncounterSerializer.one(await this.getEncounter.execute(id));
  }

  @Roles('ADMIN', 'MEDICO')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEncounterDto) {
    return EncounterSerializer.one(await this.updateEncounter.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteEncounter.execute(id);
    return { deleted: true };
  }
}
