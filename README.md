# Kafkajs-consumer-middleware
## Motivation
Like express, koa or another server based in http protocol, we can use middleware chain for encapsulate logics like tracking, filters, validations, etc before and after of your main business logic. So this library enable that same behavior but when consume your messages from kafka

## Install
This library is addon for [kafkajs](https://www.npmjs.com/package/kafkajs) package.
```npm install -S kafkajs-consumer-middleware```

## Use
First you need to create a kafka instance.
```
// Import kafkajs package
const { Kafka } = require('kafkajs')

// Create kafka instance
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})
```
Later when create the consumer, use the **kafkaConsumerMiddleware** function
```
const kafkaConsumerMiddleware = require('kafkajs-consumer-middleware')

const consumer = kafkaConsumerMiddleware(kafka.consumer({ groupId: 'test-group' }))
```

Now the consumer have the use method for add middlewares:
```
consumer.use(async (data, next) => {
  //Do stuff before message consuming
  return next()
})
```
The middlewares receive two parameter, the **data** from kafka message and the **next** function for control the flow of chain, can execute code after of the message consumed:
```
consumer.use(async (data, next) => {
  //Do stuff before message consuming
  await next()
  //Do stuff after message consumed
})
```

The consumer works the same way
```
  // Connect and subscribe topic
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  // listening message with eachMessage option.
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
```

## Limitations
The middleware behavior was implemented **only for eachMessage** options of consumer.
