import { Controller, Post, Get, Patch, Delete, Param, Body, Inject, Query, ParseIntPipe, BadRequestException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { PRODUCT_SERVICE } from 'src/config/services'

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy

  ) { }

  @Post()
  createProduct() {
    return 'Product created successfully'
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto)
  }

  @Get(':id')
  async findProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id })
      )
      return product
    }
    catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return 'Product updated successfully'
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return 'Product deleted successfully'
  }
}
