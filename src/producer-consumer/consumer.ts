import Queue from './queue'
import { lock, unlock } from '@libmedia/cheap/thread/mutex'
import { wait, signal } from '@libmedia/cheap/thread/cond'
import { ThreadId } from '@libmedia/cheap/heap'
import Sleep from '@libmedia/common/timer/Sleep'

export default async function consumer(queue: pointer<Queue>) {

  const list  = accessof(addressof(queue.list))

  while (true) {
    lock(addressof(queue.mutex))
    while (!queue.list.length && !queue.endFlag) {
      wait(addressof(queue.empty_cond), addressof(queue.mutex))
    }

    if (queue.endFlag) {
      unlock(addressof(queue.mutex))
      break
    }

    const now = list.shift()

    console.log(`consumer ${ThreadId} consume: ${now}`)

    signal(addressof(queue.full_cond))
    unlock(addressof(queue.mutex))

    await new Sleep(Math.random())
  }
  return 0
}