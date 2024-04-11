import compile from 'cheap/webassembly/compiler'
import WebAssemblyRunner from 'cheap/webassembly/WebAssemblyRunner'
import * as config from 'cheap/config'
import fs from 'fs'

import wasmFile from './main.wasm'

@struct
class Data {
  a: int32
  b: int32
  sum: int32
}

async function run() {
  const wasm = fs.readFileSync(__dirname + '/' + wasmFile)
  const resource = await compile(
    {
      source: new Uint8Array(wasm.buffer)
    },
    {
      enableThread: config.USE_THREADS,
      initFuncs: ['__wasm_apply_data_relocs', '_initialize']
    }
  )

  const runner = new WebAssemblyRunner(resource)
  await runner.run()

  const data = make(Data, {
    a: 3,
    b: 7
  })

  runner.call('interoperate', addressof(data))

  console.log(`js a: ${data.a}, b: ${data.b}, sum: ${data.sum}`)

}

run()