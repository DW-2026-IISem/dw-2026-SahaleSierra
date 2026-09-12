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
import { CreateServiceDto } from '../../../application/dto/create-service.dto.js';
import { UpdateServiceDto } from '../../../application/dto/update-service.dto.js';
import { ServiceFilterDto } from '../../../application/dto/service-filter.dto.js';
import { CreateServiceUseCase } from '../../../application/use-cases/create-service.use-case.js';
import { DeleteServiceUseCase } from '../../../application/use-cases/delete-service.use-case.js';
import { GetServiceUseCase } from '../../../application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from '../../../application/use-cases/list-services.use-case.js';
import { UpdateServiceUseCase } from '../../../application/use-cases/update-service.use-case.js';
import { ServiceSerializer } from '../serializers/service.serializer.js';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly createService: CreateServiceUseCase,
    private readonly deleteService: DeleteServiceUseCase,
    private readonly getService: GetServiceUseCase,
    private readonly listServices: ListServicesUseCase,
    private readonly updateService: UpdateServiceUseCase,
  ) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateServiceDto) {
    return ServiceSerializer.one(await this.createService.execute(dto));
  }

  @Get()
  async list(@Query() filter: ServiceFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listServices.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: ServiceSerializer.many(result.data), total: result.total };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return ServiceSerializer.one(await this.getService.execute(id));
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return ServiceSerializer.one(await this.updateService.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteService.execute(id);
    return { deleted: true };
  }
}
