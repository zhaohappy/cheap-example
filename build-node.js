
const fs = require('fs')
const path = require('path')
const ts = require('typescript')
const transformer = require('@libmedia/cheap/build/transformer')

// 读取 tsconfig.json 配置，更改为自己的 tsconfig.json 的路径
const configPath = path.resolve(__dirname, './tsconfig.node.json')
const configText = fs.readFileSync(configPath, 'utf8')
const { config } = ts.parseConfigFileTextToJson(configPath, configText)
const parsedCommandLine = ts.parseJsonConfigFileContent(
  config,
  ts.sys,
  path.dirname(configPath)
)
const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options)
const emitResult = program.emit(undefined, undefined, undefined, undefined, {
  before: [
    transformer.before(program, {
      tmpPath: path.resolve(__dirname, './dist'),
      defined: {
        ENV_NODE: true
      }
    })
  ]
})
// 打印错误
const allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics)

allDiagnostics.forEach((diagnostic) => {
  if (diagnostic.file) {
    const { line, character } =
      diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      '\n'
    );
    console.log(
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    );
  } else {
    console.log(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    );
  }
})

fs.copyFileSync(
  path.resolve(__dirname, './src/asm-simd/simd.wasm'),
  path.resolve(__dirname, './dist/node/asm-simd/simd.wasm')
);

fs.copyFileSync(
  path.resolve(__dirname, './src/js-wasm-interoperate/main.wasm'),
  path.resolve(__dirname, './dist/node/js-wasm-interoperate/main.wasm')
);