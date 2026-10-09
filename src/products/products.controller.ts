import { Controller, Post, Get, Patch, Delete, Param, Body, Inject, Query, ParseIntPipe, BadRequestException } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, firstValueFrom } from 'rxjs'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { PRODUCT_SERVICE } from 'src/config/services'
import { StringDecoder } from 'string_decoder'
import { UpdateProductDto } from './dto/update-product.dto'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy

  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto)
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
  updateProduct(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    }).pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => {
          throw new RpcException(err)
        })
      )
  }
}
