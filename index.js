const chain =  (...fns) => async (data) => {
  let pointer = 0
  const next = async () => {
    if(pointer < fns.length - 1) {
      const fn = fns[pointer]
      pointer++
      await fn(data, next)
    } else if(fns.length > 0) {
      const fn = fns[pointer]
      pointer = 0
      await fn(data)
    } else {
      pointer = 0
    }
  }
  const fn = fns[pointer]
  pointer++
  await fn(data, next)
}

const kafkaConsumerMiddleware = consumer => {
  const middlewares = []

  const use = middleware => middlewares.push(middleware)

  const run = consumer.run
  const runMiddleware = async (options) => {
      const { eachMessage } = options
      const middlewareChain = (!!eachMessage) ? chain(...middlewares, eachMessage) : undefined
      await run({
        ...options,
        eachMessage: middlewareChain
      })
  }

  consumer['run'] = runMiddleware
  consumer['use'] = use

  return consumer
}

module.exports = kafkaConsumerMiddleware
