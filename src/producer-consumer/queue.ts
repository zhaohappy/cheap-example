import List from 'cheap/std/collection/List'
import { Cond } from 'cheap/thread/cond'
import { Mutex } from 'cheap/thread/mutex'

@struct
export default class Queue {
  queue: List<int32>
  max: uint32
  mutex: Mutex
  full_cond: Cond
  empty_cond: Cond
  endFlag: int32
}