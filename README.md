# chatgpt-demo-server
server of chatgpt demo

## Intro
As server of [chatgpt-demo-web](https://github.com/SJcz/chatgpt-demo-web), this project used [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) module.

So, before run this project, below conditions need to be prepare:
1. Make sure you're using node >= 18 so fetch is available (or node >= 14 if you install a fetch polyfill).
2. Own an [OpenAI API key](https://platform.openai.com/overview)
 

## Usage
1. Clone the repository:  
```
git clone git@github.com:SJcz/chatgpt-demo-server.git
```

2. Install the dependencies:  
```
npm install
```

3. Modify .env file in the root folder, set your OpenAI API key in the following format:  
```
OPENAI_API_KEY=your_api_key
```

4. Start node server:  
```
npm run start
```

aftr server start, it will start webscoket server and a http server. 
* http server default prot: 10010. 
* websocket default port: 9090. 

if you want change webscoket port, you can modify `WS_PORT` filed of .env file in the root folder


## Snipaste
<image src="/snipaste/Snipaste_chat.png" width="1200"/>

