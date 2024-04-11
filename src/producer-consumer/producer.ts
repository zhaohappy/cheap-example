import Queue from './queue'
import { lock, unlock } from 'cheap/thread/mutex'
import { wait, signal } from 'cheap/thread/cond'
import Sleep from 'common/timer/Sleep'
import { ThreadId } from 'cheap/heap'

export default async function producer(queue: pointer<Queue>) {

  let item: int32 = 0

  const list  = accessof(addressof(queue.queue))

  while (true) {

    lock(addressof(queue.mutex))
    while (queue.queue.length === queue.max && !queue.endFlag) {
      wait(addressof(queue.full_cond), addressof(queue.mutex))
    }

    if (queue.endFlag) {
      unlock(addressof(queue.mutex))
      break
    }

    const now = item++

    console.log(`producer ${ThreadId} produce: ${now}`)

    list.push(now)

    signal(addressof(queue.empty_cond))
    unlock(addressof(queue.mutex))

    await new Sleep(Math.random())
  }
  return 0
}