import List from 'cheap/std/collection/List'
import { Cond } from 'cheap/thread/cond'
import { Mutex } from 'cheap/thread/mutex'

@struct
export default class Queue {
  // 生产者生产的数据，这里以一个 int32 数据为例
  list: List<int32>
  // 生产队列最大长度，当队列达到最大长度生产者挂起线程等待消费者消费之后载唤醒生产数据
  max: uint32
  // 数据队列操作锁，用于对队列的操作保护
  mutex: Mutex
  // 队列满的条件变量
  full_cond: Cond
  // 队列空的条件变量
  empty_cond: Cond
  // 结束任务的标志
  endFlag: int32
}