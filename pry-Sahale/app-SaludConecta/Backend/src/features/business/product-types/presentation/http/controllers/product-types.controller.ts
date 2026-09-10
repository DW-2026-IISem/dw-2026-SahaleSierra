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
import { CreateProductTypeDto } from '../../../application/dto/create-product-type.dto.js';
import { UpdateProductTypeDto } from '../../../application/dto/update-product-type.dto.js';
import { ProductTypeFilterDto } from '../../../application/dto/product-type-filter.dto.js';
import { ProductTypeResponseDto } from '../../../application/dto/product-type-response.dto.js';
import { CreateProductTypeUseCase } from '../../../application/use-cases/create-product-type.use-case.js';
import { UpdateProductTypeUseCase } from '../../../application/use-cases/update-product-type.use-case.js';
import { DeleteProductTypeUseCase } from '../../../application/use-cases/delete-product-type.use-case.js';
import { GetProductTypeUseCase } from '../../../application/use-cases/get-product-type.use-case.js';
import { ListProductTypesUseCase } from '../../../application/use-cases/list-product-types.use-case.js';

@ApiTags('Product Types')
@Controller('product-types')
export class ProductTypesController {
  constructor(
    private readonly createProductTypeUseCase: CreateProductTypeUseCase,
    private readonly updateProductTypeUseCase: UpdateProductTypeUseCase,
    private readonly deleteProductTypeUseCase: DeleteProductTypeUseCase,
    private readonly getProductTypeUseCase: GetProductTypeUseCase,
    private readonly listProductTypesUseCase: ListProductTypesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un tipo de producto' })
  @ApiCreatedResponse({ type: ProductTypeResponseDto })
  create(@Body() dto: CreateProductTypeDto) {
    return this.createProductTypeUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de producto' })
  @ApiOkResponse({ type: [ProductTypeResponseDto] })
  findAll(@Query() filter: ProductTypeFilterDto) {
    return this.listProductTypesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de producto por ID' })
  @ApiOkResponse({ type: ProductTypeResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getProductTypeUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de producto' })
  @ApiOkResponse({ type: ProductTypeResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateProductTypeDto,
  ) {
    return this.updateProductTypeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un tipo de producto' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteProductTypeUseCase.execute(id);
  }
}
