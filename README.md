# Kafkajs-consumer-middleware
## Motivation
Like express, koa or another server based in http protocol, we can user middleware chain for encapsulate logics like tracking, filters, validations, etc before and after of your main business logic. So this library enable that same behavior but when consume your messages from kafka

## Install
This library is addon for [kafkajs](https://www.npmjs.com/package/kafkajs) package.
```npm install -S kafkajs-consumer-middleware```

## Use
```
// Import kafkajs package
const { Kafka } = require('kafkajs')
const kafkaConsumerMiddleware = require('kafkajs-consumer-middleware')

// Create kafka instance
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const producer = kafka.producer()

// When create consumer, pass to the middleware function for add behavior.
const consumer = kafkaConsumerMiddleware(kafka.consumer({ groupId: 'test-group' }))

// Now you can use a middleware function
consumer.use(async (data, next) => {
  //Do stuff before message consuming
  console.log('Middleware', data)
  return next()
})

const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  // You listen message with the same eachMessage option.
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)


//Console Output

{"level":"INFO","timestamp":"2021-11-29T13:37:28.788Z","logger":"kafkajs","message":"[Consumer] Starting","groupId":"test-group"}
{"level":"INFO","timestamp":"2021-11-29T13:37:28.831Z","logger":"kafkajs","message":"[ConsumerGroup] Consumer has joined the group","groupId":"test-group","memberId":"my-app-217982f5-f187-4573-9a29-56716767669b","leaderId":"my-app-217982f5-f187-4573-9a29-56716767669b","isLeader":true,"memberAssignment":{"test-topic":[0]},"groupProtocol":"RoundRobinAssigner","duration":40}
Middleware {
  topic: 'test-topic',
  partition: 0,
  message: {
    offset: '3',
    size: 41,
    crc: 1610465194,
    magicByte: 1,
    attributes: 0,
    timestamp: '1638193048773',
    key: null,
    value: <Buffer 48 65 6c 6c 6f 20 4b 61 66 6b 61 4a 53 20 75 73 65 72 21>
  }
}
{ partition: 0, offset: '3', value: 'Hello KafkaJS user!' }
```
You can also do some logic after message consuming:
```
consumer.use(async (data, next) => {
  console.log('Middleware before', info)
  await next()
  console.log('Middleware after', info)
})
```
