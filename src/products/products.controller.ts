import { Controller, Post, Get, Patch, Delete, Param, Body, Inject, Query, ParseIntPipe, BadRequestException } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, firstValueFrom } from 'rxjs'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { PRODUCT_SERVICE } from 'src/config/services'
import { StringDecoder } from 'string_decoder'

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
  async findOne(@Param('id') id: string) {

    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      )

    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   )
    //   return product
    // }
    // catch (error: Error | any) 
    // {
    //    throw new RpcException(error)
    // }
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
