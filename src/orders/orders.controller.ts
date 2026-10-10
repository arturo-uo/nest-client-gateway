import { Controller, Query, Get, Post, Body, Param, Inject, ParseUUIDPipe, } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { ORDERS_SERVICE } from 'src/config'
import { CreateOrderDto, OrderPaginationDto } from './dto'
import { firstValueFrom } from 'rxjs'

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
    console.log(orderPaginationDto)
    orderPaginationDto.
    return this.ordersClient.send('findAllOrders', orderPaginationDto)
  }

  @Get(':id')
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
}
