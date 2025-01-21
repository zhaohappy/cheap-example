declare module '*.wasm' {
  const content: string
  export default content
}

declare const ENV_NODE: boolean