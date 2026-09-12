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
import { CreateInvoiceDto } from '../../../application/dto/create-invoice.dto.js';
import { InvoiceFilterDto } from '../../../application/dto/invoice-filter.dto.js';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case.js';
import { PayInvoiceUseCase } from '../../../application/use-cases/pay-invoice.use-case.js';
import { CancelInvoiceUseCase } from '../../../application/use-cases/cancel-invoice.use-case.js';
import { GetInvoiceUseCase } from '../../../application/use-cases/get-invoice.use-case.js';
import { ListInvoicesUseCase } from '../../../application/use-cases/list-invoices.use-case.js';
import { DeleteInvoiceUseCase } from '../../../application/use-cases/delete-invoice.use-case.js';
import { InvoiceSerializer } from '../serializers/invoice.serializer.js';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly createInvoice: CreateInvoiceUseCase,
    private readonly payInvoice: PayInvoiceUseCase,
    private readonly cancelInvoice: CancelInvoiceUseCase,
    private readonly getInvoice: GetInvoiceUseCase,
    private readonly listInvoices: ListInvoicesUseCase,
    private readonly deleteInvoice: DeleteInvoiceUseCase,
  ) {}

  @Roles('ADMIN', 'FACTURACION')
  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    return InvoiceSerializer.one(await this.createInvoice.execute(dto));
  }

  @Roles('ADMIN', 'FACTURACION')
  @Get()
  async list(@Query() filter: InvoiceFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listInvoices.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: InvoiceSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'FACTURACION')
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return InvoiceSerializer.one(await this.getInvoice.execute(id));
  }

  @Roles('ADMIN', 'FACTURACION')
  @Patch(':id/pay')
  async pay(@Param('id', ParseIntPipe) id: number) {
    return InvoiceSerializer.one(await this.payInvoice.execute(id));
  }

  @Roles('ADMIN', 'FACTURACION')
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return InvoiceSerializer.one(await this.cancelInvoice.execute(id));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteInvoice.execute(id);
    return { deleted: true };
  }
}
