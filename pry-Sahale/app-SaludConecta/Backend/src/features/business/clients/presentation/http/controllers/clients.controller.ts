import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe.js';
import { CreateClientDto } from '../../../application/dto/create-client.dto.js';
import { UpdateClientDto } from '../../../application/dto/update-client.dto.js';
import { ClientFilterDto } from '../../../application/dto/client-filter.dto.js';
import { ClientResponseDto } from '../../../application/dto/client-response.dto.js';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case.js';
import { UpdateClientUseCase } from '../../../application/use-cases/update-client.use-case.js';
import { DeleteClientUseCase } from '../../../application/use-cases/delete-client.use-case.js';
import { GetClientUseCase } from '../../../application/use-cases/get-client.use-case.js';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case.js';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly listClientsUseCase: ListClientsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiCreatedResponse({ type: ClientResponseDto })
  create(@Body() dto: CreateClientDto) {
    return this.createClientUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiOkResponse({ type: [ClientResponseDto] })
  findAll(@Query() filter: ClientFilterDto) {
    return this.listClientsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiOkResponse({ type: ClientResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getClientUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiOkResponse({ type: ClientResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ) {
    return this.updateClientUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteClientUseCase.execute(id);
  }
}
