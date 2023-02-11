# chatgpt-demo-server
chatgpt demo 的服务端

## 介绍
作为 [chatgpt-demo-web](https://github.com/SJcz/chatgpt-demo-web) web 应用的服务端, 该项目基于 [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) 模块进行开发.  

`chatgpt-api` 模块有 node 版本要求, 因此, 运行该项目之前, 确保以下两个条件已经达成
1. 确保使用的 node 版本 >= 18(自带 `fetch`) , 或者 node 版本 >= 14 并且已经安装了 ` fetch polyfill`
2. 拥有一个 [OpenAI API key](https://platform.openai.com/overview)
 

## 使用
1. 克隆仓库到本地:  
```
git clone git@github.com:SJcz/chatgpt-demo-server.git
```

2. 安装依赖:  
```
npm install
```

3. 修改项目根目录下的 `.env` 文件, 设置你自己的 OpenAI API key:  
```
OPENAI_API_KEY=your_api_key
```

4. 启动服务:  
```
npm run start
```

服务启动后, 将会起一个 `websocket` 服务器和一个 `http` 服务器（以便处理web端额外的请求）
* `http` 服务器默认端口: 10010. 
* `websocket` 服务器默认端口: 9090. 

如果你想修改 `websocket` 的默认端口, 可以修改 `.env` 文件中的 `WS_PORT` 字段

## web端效果图
<image src="/snipaste/Snipaste_chat.png" width="1200"/>

