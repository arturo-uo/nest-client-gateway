import { Controller, Get, Post, Body, Param, Inject, } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { ORDERS_SERVICE } from 'src/config/services'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly productsClient: ClientProxy

  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.productsClient.send('createOrder', { createOrderDto })
  }

  @Get()
  findAll() {
    return this.productsClient.send('findAllOrders', {})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send('findOneOrder', { id })
  }
}
