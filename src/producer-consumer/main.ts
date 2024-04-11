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
  
  const consumerThreads = await Promise.all(new Array(os.cpus().length - 1).fill(0).map(() => {
    return createThreadFromFunction(consumer).run(addressof(queue))
  }))

  await new Sleep(300)

  queue.endFlag = 1
  cond.broadcast(addressof(queue.empty_cond))
  cond.broadcast(addressof(queue.full_cond))

  await joinThread(produceThread)

  const result = await Promise.all(consumerThreads.map((thread) => {
    return joinThread(thread)
  }))

  console.log(result)

  console.log('end')
}

run()