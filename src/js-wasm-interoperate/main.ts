import compile from '@libmedia/cheap/webassembly/compiler'
import WebAssemblyRunner from '@libmedia/cheap/webassembly/WebAssemblyRunner'

import wasmFile from './main.wasm'

@struct
class Data {
  a: int32
  b: int32
  sum: int32
}

async function run() {

  const resource = await compile(
    {
      source: wasmFile
    }
  )

  const runner = new WebAssemblyRunner(resource)
  await runner.run()

  const data = make<Data>({
    a: 3,
    b: 7
  })

  runner.invoke('interoperate', addressof(data))

  console.log(`js a: ${data.a}, b: ${data.b}, sum: ${data.sum}`)

  unmake(data)
  runner.destroy()
}

run()