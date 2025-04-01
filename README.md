cheap-example
======

### 介绍

cheap 使用的简单示例

### 使用


```shell

# 克隆项目以及所有子模块
git clone git@github.com:zhaohappy/cheap-example.git

# 安装依赖
npm install

# 编译 web 版
npm run build

# 编译 node 版
npm run build-node

# node dist/node/producer-consumer/main.node.js

# 本地起一个 http 服务，访问 test 目录下的测试页面查看 web 运行结果
npm run server

```

### Demo

- ```js-wasm-interoperate``` 如何在 cheap 中让 js 和 wasm struct 进行互操作
- ```producer-consumer``` 如何在 cheap 中使用生产者消费者多线程模型
- ```asm-simd``` 如何在 cheap 中使用 asm 优化


### 开源协议

[MIT](https://opensource.org/licenses/MIT)
