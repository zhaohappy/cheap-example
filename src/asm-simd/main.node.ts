
import compile from '@libmedia/cheap/webassembly/compiler'
import WebAssemblyRunner from '@libmedia/cheap/webassembly/WebAssemblyRunner'
import fs from 'fs'

import processWasm from './process.asm'
import processSimdWasm from './process-simd.asm'
import ASMRunner from '@libmedia/cheap/asm/ASMRunner'

@struct
class Point {
  x: float
  y: float
  z: float
  w: float
}

const LOOP_COUNT = 1
const POINT_LENGTH: int32 = 1000000 * 4

const points: Point[] = []
for (let i = 0; i < POINT_LENGTH; i++) {
  const point = new Point()
  point.x = Math.random()
  point.y = Math.random()
  point.z = Math.random()
  point.w = 1.0
  points.push(point)
}
const rotateMatrix = new Float32Array([
  Math.sqrt(3) / 2, -0.5, 0, 0,
  0.5, Math.sqrt(3) / 2, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
])

function runJsMultiplyVector4(points: Point[]) {
  const matrix = rotateMatrix

  const src: Point[] = points
  const dst: Point[] = []

  for (let i = 0; i < POINT_LENGTH; i++) {
    dst.push(new Point())
  }

  console.time('runJsMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    for (let i = 0; i < POINT_LENGTH; i++) {
      dst[i].x = src[i].x * matrix[0] + src[i].y * matrix[4] + src[i].z * matrix[8] + src[i].w * matrix[12]
      dst[i].y = src[i].x * matrix[1] + src[i].y * matrix[5] + src[i].z * matrix[9] + src[i].w * matrix[13]
      dst[i].z = src[i].x * matrix[2] + src[i].y * matrix[6] + src[i].z * matrix[10] + src[i].w * matrix[14]
      dst[i].w = src[i].x * matrix[3] + src[i].y * matrix[7] + src[i].z * matrix[11] + src[i].w * matrix[15]
    }
  }

  console.timeEnd('runJsMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }
}

function runCheapMultiplyVector4(points: Point[]) {
  const matrix: pointer<float> = malloc(sizeof(float) * 16)
  for (let i = 0; i < 16; i ++) {
    matrix[i] = static_cast<float>(rotateMatrix[i])
  }

  const src = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))
  const dst = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))

  for (let i = 0; i < POINT_LENGTH; i++) {
    src[i].x = points[i].x
    src[i].y = points[i].y
    src[i].z = points[i].z
    src[i].w = points[i].w
  }

  console.time('runCheapMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    for (let i = 0; i < POINT_LENGTH; i++) {
      dst[i].x = src[i].x * matrix[0] + src[i].y * matrix[4] + src[i].z * matrix[8] + src[i].w * matrix[12]
      dst[i].y = src[i].x * matrix[1] + src[i].y * matrix[5] + src[i].z * matrix[9] + src[i].w * matrix[13]
      dst[i].z = src[i].x * matrix[2] + src[i].y * matrix[6] + src[i].z * matrix[10] + src[i].w * matrix[14]
      dst[i].w = src[i].x * matrix[3] + src[i].y * matrix[7] + src[i].z * matrix[11] + src[i].w * matrix[15]
    }
  }

  console.timeEnd('runCheapMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }

  free(src)
  free(dst)
  free(matrix)
}

async function runWasmMultiplyVector4(points: Point[]) {
  const matrix: pointer<float> = malloc(sizeof(float) * 16)

  for (let i = 0; i < 16; i ++) {
    matrix[i] = static_cast<float>(rotateMatrix[i])
  }

  const src = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))
  const dst = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))

  for (let i = 0; i < POINT_LENGTH; i++) {
    src[i].x = points[i].x
    src[i].y = points[i].y
    src[i].z = points[i].z
    src[i].w = points[i].w
  }

  let source: string | Uint8Array<ArrayBuffer>

  const wasm = fs.readFileSync(__dirname + '/simd.wasm')
  source = new Uint8Array<ArrayBuffer>(wasm.buffer as ArrayBuffer, wasm.byteOffset, wasm.byteLength / Uint8Array.BYTES_PER_ELEMENT)

  const resource = await compile(
    {
      source
    }
  )

  const runner = new WebAssemblyRunner(resource)

  await runner.run()

  console.time('runWasmMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    runner.invoke('process', dst, src, POINT_LENGTH, matrix)
  }

  console.timeEnd('runWasmMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }

  free(src)
  free(dst)
  free(matrix)
  runner.destroy()
}

async function runWasmSimdMultiplyVector4(points: Point[]) {
  const matrix: pointer<float> = malloc(sizeof(float) * 16)

  for (let i = 0; i < 16; i ++) {
    matrix[i] = static_cast<float>(rotateMatrix[i])
  }

  const src = reinterpret_cast<pointer<Point>>(aligned_alloc(16, sizeof(Point) * static_cast<size>(POINT_LENGTH)))
  const dst = reinterpret_cast<pointer<Point>>(aligned_alloc(16, sizeof(Point) * static_cast<size>(POINT_LENGTH)))

  for (let i = 0; i < POINT_LENGTH; i++) {
    src[i].x = points[i].x
    src[i].y = points[i].y
    src[i].z = points[i].z
    src[i].w = points[i].w
  }

  let source: string | Uint8Array<ArrayBuffer>

  const wasm = fs.readFileSync(__dirname + '/simd.wasm')
  source = new Uint8Array(wasm.buffer as ArrayBuffer, wasm.byteOffset, wasm.byteLength / Uint8Array.BYTES_PER_ELEMENT)

  const resource = await compile(
    {
      source
    }
  )

  const runner = new WebAssemblyRunner(resource)

  await runner.run()

  console.time('runWasmSimdMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    runner.invoke('process_simd', dst, src, POINT_LENGTH, matrix)
  }
  

  console.timeEnd('runWasmSimdMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }

  free(src)
  free(dst)
  free(matrix)
  runner.destroy()
}

async function runAsmMultiplyVector4(points: Point[]) {
  const matrix: pointer<float> = malloc(sizeof(float) * 16)

  for (let i = 0; i < 16; i ++) {
    matrix[i] = static_cast<float>(rotateMatrix[i])
  }

  const src = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))
  const dst = reinterpret_cast<pointer<Point>>(malloc(sizeof(Point) * static_cast<size>(POINT_LENGTH)))

  for (let i = 0; i < POINT_LENGTH; i++) {
    src[i].x = points[i].x
    src[i].y = points[i].y
    src[i].z = points[i].z
    src[i].w = points[i].w
  }

  const runner = new ASMRunner(processWasm)

  console.time('runAsmMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    runner.invoke('process', dst, src, POINT_LENGTH, matrix)
  }

  console.timeEnd('runAsmMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }

  free(src)
  free(dst)
  free(matrix)
  runner.destroy()
}

async function runAsmSimdMultiplyVector4(points: Point[]) {
  const matrix: pointer<float> = malloc(sizeof(float) * 16)

  for (let i = 0; i < 16; i ++) {
    matrix[i] = static_cast<float>(rotateMatrix[i])
  }

  const src = reinterpret_cast<pointer<Point> >(aligned_alloc(16, sizeof(Point) * static_cast<size>(POINT_LENGTH)))
  const dst = reinterpret_cast<pointer<Point>>(aligned_alloc(16, sizeof(Point) * static_cast<size>(POINT_LENGTH)))

  for (let i = 0; i < POINT_LENGTH; i++) {
    src[i].x = points[i].x
    src[i].y = points[i].y
    src[i].z = points[i].z
    src[i].w = points[i].w
  }


  const runner = new ASMRunner(processSimdWasm)

  console.time('runAsmSimdMultiplyVector4')

  for (let j = 0; j < LOOP_COUNT; j++) {
    runner.invoke('process_simd', dst, src, POINT_LENGTH, matrix)
  }

  console.timeEnd('runAsmSimdMultiplyVector4')

  // for (let i = 0; i < POINT_LENGTH; i++) {
  //   console.log(dst[i].x, dst[i].y, dst[i].z, dst[i].w)
  // }

  free(src)
  free(dst)
  free(matrix)
  runner.destroy()
}

setTimeout(() => {
  runJsMultiplyVector4(points)
  runCheapMultiplyVector4(points)
  runWasmMultiplyVector4(points)
  runWasmSimdMultiplyVector4(points)
  runAsmMultiplyVector4(points)
  runAsmSimdMultiplyVector4(points)
}, 1000)
