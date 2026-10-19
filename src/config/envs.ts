import 'dotenv/config'

import * as joi from 'joi'

interface EnvVars{
	PORT: number
	// PRODUCTS_MICROSERVICE_HOST:string
    // PRODUCTS_MICROSERVICE_PORT:number
	// ORDERS_MICROSERVICE_HOST:string
    // ORDERS_MICROSERVICE_PORT:number
  	NATS_SERVERS: string[]
	//JWT_SECRET: string
}

const envsSchema = joi.object<EnvVars>({
	PORT: joi.number().required(),
	// PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
	// PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
	// ORDERS_MICROSERVICE_HOST: joi.string().required(),
	// ORDERS_MICROSERVICE_PORT: joi.number().required(),
  	NATS_SERVERS: joi.array().items(joi.string()).required()//,
	//JWT_SECRET: joi.string().required()
})
.unknown()

const { error, value } = envsSchema.validate({
	...process.env,
	NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if(error){
	throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value as EnvVars

export const envs = {
	port: envVars.PORT,
	// productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
	// productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
	// ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
	// ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
  	natsServers: envVars.NATS_SERVERS//,
	//jwtSecret: envVars.JWT_SECRET
}