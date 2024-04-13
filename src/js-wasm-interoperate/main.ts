import compile from 'cheap/webassembly/compiler'
import WebAssemblyRunner from 'cheap/webassembly/WebAssemblyRunner'
import fs from 'fs'

import wasmFile from './main.wasm'

@struct
class Data {
  a: int32
  b: int32
  sum: int32
}

async function run() {

  let source: string | Uint8Array

  if (defined(ENV_NODE)) {
    const wasm = fs.readFileSync(__dirname + '/' + wasmFile)
    source = new Uint8Array(wasm.buffer, wasm.byteOffset, wasm.byteLength / Uint8Array.BYTES_PER_ELEMENT)
  }
  else {
    source = wasmFile
  }

  const resource = await compile(
    {
      source
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

  unmake(data)
  runner.destroy()
}

run()