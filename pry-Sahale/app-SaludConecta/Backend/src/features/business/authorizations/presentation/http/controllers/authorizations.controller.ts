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
import { CreateAuthorizationDto } from '../../../application/dto/create-authorization.dto.js';
import { UpdateAuthorizationDto } from '../../../application/dto/update-authorization.dto.js';
import { AuthorizationFilterDto } from '../../../application/dto/authorization-filter.dto.js';
import { CreateAuthorizationUseCase } from '../../../application/use-cases/create-authorization.use-case.js';
import { DeleteAuthorizationUseCase } from '../../../application/use-cases/delete-authorization.use-case.js';
import { GetAuthorizationUseCase } from '../../../application/use-cases/get-authorization.use-case.js';
import { ListAuthorizationsUseCase } from '../../../application/use-cases/list-authorizations.use-case.js';
import { UpdateAuthorizationUseCase } from '../../../application/use-cases/update-authorization.use-case.js';
import { AuthorizationSerializer } from '../serializers/authorization.serializer.js';

@ApiTags('authorizations')
@Controller('authorizations')
export class AuthorizationsController {
  constructor(
    private readonly createAuthorization: CreateAuthorizationUseCase,
    private readonly deleteAuthorization: DeleteAuthorizationUseCase,
    private readonly getAuthorization: GetAuthorizationUseCase,
    private readonly listAuthorizations: ListAuthorizationsUseCase,
    private readonly updateAuthorization: UpdateAuthorizationUseCase,
  ) {}

  @Roles('ADMIN', 'FACTURACION')
  @Post()
  async create(@Body() dto: CreateAuthorizationDto) {
    return AuthorizationSerializer.one(await this.createAuthorization.execute(dto));
  }

  @Roles('ADMIN', 'FACTURACION', 'AUDITOR_CLINICO')
  @Get()
  async list(@Query() filter: AuthorizationFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listAuthorizations.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: AuthorizationSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'FACTURACION', 'AUDITOR_CLINICO')
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return AuthorizationSerializer.one(await this.getAuthorization.execute(id));
  }

  @Roles('ADMIN', 'FACTURACION')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorizationDto) {
    return AuthorizationSerializer.one(await this.updateAuthorization.execute(id, dto));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteAuthorization.execute(id);
    return { deleted: true };
  }
}
