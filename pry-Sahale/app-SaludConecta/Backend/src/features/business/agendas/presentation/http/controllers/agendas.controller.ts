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
import { CreateAgendaDto } from '../../../application/dto/create-agenda.dto.js';
import { UpdateAgendaDto } from '../../../application/dto/update-agenda.dto.js';
import { AgendaFilterDto } from '../../../application/dto/agenda-filter.dto.js';
import { CreateAgendaUseCase } from '../../../application/use-cases/create-agenda.use-case.js';
import { DeleteAgendaUseCase } from '../../../application/use-cases/delete-agenda.use-case.js';
import { GetAgendaUseCase } from '../../../application/use-cases/get-agenda.use-case.js';
import { ListAgendasUseCase } from '../../../application/use-cases/list-agendas.use-case.js';
import { UpdateAgendaUseCase } from '../../../application/use-cases/update-agenda.use-case.js';
import { AgendaSerializer } from '../serializers/agenda.serializer.js';

@ApiTags('agendas')
@Controller('agendas')
export class AgendasController {
  constructor(
    private readonly createAgenda: CreateAgendaUseCase,
    private readonly deleteAgenda: DeleteAgendaUseCase,
    private readonly getAgenda: GetAgendaUseCase,
    private readonly listAgendas: ListAgendasUseCase,
    private readonly updateAgenda: UpdateAgendaUseCase,
  ) {}

  @Roles('ADMIN', 'MEDICO')
  @Post()
  async create(@Body() dto: CreateAgendaDto) {
    return AgendaSerializer.one(await this.createAgenda.execute(dto));
  }

  @Get()
  async list(@Query() filter: AgendaFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listAgendas.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: AgendaSerializer.many(result.data), total: result.total };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return AgendaSerializer.one(await this.getAgenda.execute(id));
  }

  @Roles('ADMIN', 'MEDICO')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgendaDto) {
    return AgendaSerializer.one(await this.updateAgenda.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteAgenda.execute(id);
    return { deleted: true };
  }
}
