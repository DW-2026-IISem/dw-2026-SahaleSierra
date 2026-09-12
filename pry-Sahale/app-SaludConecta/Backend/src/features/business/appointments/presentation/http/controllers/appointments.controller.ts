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
import { CreateAppointmentDto } from '../../../application/dto/create-appointment.dto.js';
import { RescheduleAppointmentDto } from '../../../application/dto/reschedule-appointment.dto.js';
import { AppointmentFilterDto } from '../../../application/dto/appointment-filter.dto.js';
import { CreateAppointmentUseCase } from '../../../application/use-cases/create-appointment.use-case.js';
import { RescheduleAppointmentUseCase } from '../../../application/use-cases/reschedule-appointment.use-case.js';
import { CancelAppointmentUseCase } from '../../../application/use-cases/cancel-appointment.use-case.js';
import { GetAppointmentUseCase } from '../../../application/use-cases/get-appointment.use-case.js';
import { ListAppointmentsUseCase } from '../../../application/use-cases/list-appointments.use-case.js';
import { DeleteAppointmentUseCase } from '../../../application/use-cases/delete-appointment.use-case.js';
import { AppointmentSerializer } from '../serializers/appointment.serializer.js';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly createAppointment: CreateAppointmentUseCase,
    private readonly rescheduleAppointment: RescheduleAppointmentUseCase,
    private readonly cancelAppointment: CancelAppointmentUseCase,
    private readonly getAppointment: GetAppointmentUseCase,
    private readonly listAppointments: ListAppointmentsUseCase,
    private readonly deleteAppointment: DeleteAppointmentUseCase,
  ) {}

  @Roles('ADMIN', 'ADMISIONES')
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return AppointmentSerializer.one(await this.createAppointment.execute(dto));
  }

  @Roles('ADMIN', 'ADMISIONES', 'MEDICO')
  @Get()
  async list(@Query() filter: AppointmentFilterDto, @Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.listAppointments.execute(filter, { page: Number(page), limit: Number(limit) });
    return { data: AppointmentSerializer.many(result.data), total: result.total };
  }

  @Roles('ADMIN', 'ADMISIONES', 'MEDICO')
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return AppointmentSerializer.one(await this.getAppointment.execute(id));
  }

  @Roles('ADMIN', 'ADMISIONES')
  @Patch(':id')
  async reschedule(@Param('id', ParseIntPipe) id: number, @Body() dto: RescheduleAppointmentDto) {
    return AppointmentSerializer.one(await this.rescheduleAppointment.execute(id, dto));
  }

  @Roles('ADMIN', 'ADMISIONES')
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return AppointmentSerializer.one(await this.cancelAppointment.execute(id));
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteAppointment.execute(id);
    return { deleted: true };
  }
}
