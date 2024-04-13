import consumer from './consumer'
import producer from './producer'

import { createThreadFromFunction, joinThread } from 'cheap/thread/thread'
import Queue from './queue'
import * as mutex from 'cheap/thread/mutex'
import * as cond from 'cheap/thread/cond'

import * as os from 'os'
import Sleep from 'common/timer/Sleep'

async function run() {

  const queue = make(Queue)

  queue.endFlag = 0
  queue.max = 7

  mutex.init(addressof(queue.mutex))
  cond.init(addressof(queue.empty_cond))
  cond.init(addressof(queue.full_cond))

  const produceThread = await createThreadFromFunction(producer).run(addressof(queue))

  let consumerCount = 0
  if (defined(ENV_NODE)) {
    consumerCount = os.cpus().length - 1
  }
  else {
    consumerCount = navigator.hardwareConcurrency - 1
  }
  
  const consumerThreads = await Promise.all(new Array(consumerCount).fill(0).map(() => {
    return createThreadFromFunction(consumer).run(addressof(queue))
  }))

  await new Sleep(30)

  queue.endFlag = 1
  cond.broadcast(addressof(queue.empty_cond))
  cond.broadcast(addressof(queue.full_cond))

  await joinThread(produceThread)

  await Promise.all(consumerThreads.map((thread) => {
    return joinThread(thread)
  }))

  mutex.destroy(addressof(queue.mutex))
  cond.destroy(addressof(queue.empty_cond))
  cond.destroy(addressof(queue.full_cond))

  queue.queue.clear()

  unmake(queue)
}

run()