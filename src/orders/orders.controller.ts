import { Controller, Query, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { ORDERS_SERVICE } from 'src/config'
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto'
import { firstValueFrom } from 'rxjs'
import { PaginationDto } from 'src/common'

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy

  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    console.log(createOrderDto)
    return this.ordersClient.send('createOrder', createOrderDto)
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto)
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      )
      return order
    }
    catch (error: Error | any) {
      throw new RpcException(error.message)
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto) {
    try {
      return this.ordersClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status
      })
    }
    catch (error: Error | any) {
      throw new RpcException(error.message)
    }
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto) {
    //return { id, status: statusDto.status }
    try {
      return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    }
    catch (error: Error | any) {
      throw new RpcException(error)
    }
  }
}
