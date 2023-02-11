import WS from 'ws'

/**用于测试！！！！ */
function joinRoom(min: number, max: number) {
	for (let i = min; i < max; i++) {
		const client = new WS('ws://127.0.0.1:9090/websocket')
		let n = 1
		client.on('error', (err) => {
			console.log(err)
			client.close()
		})
		client.on('close', (code, reason) => {
			console.log(code, reason)
		})
		client.on('message', function message(msg) {
			console.log(JSON.parse(msg.toString()))
		})
		client.on('open', function open() {
			console.log('connect')
			client.send(JSON.stringify({
				type: 'request',
				route: 'chatHandler.chat',
				requestId: String(i),
				data:  '你好呀'
			}))
			// setInterval(() => {
			// 	client.send(JSON.stringify({
			// 		route: 'chatHandler.chat',
			// 		data: {
			// 			room_id: 'onlyOne',
			// 			chat_message: {
			// 				type: 'text',
			// 				content: `我是客户端 name_${i} 大家好, 这是我发的第${n++}条消息`
			// 			}
			// 		}
			// 	}))
			// }, 10000)
		})
	}
}

// joinRoom(1, 50)

let cur = 0

const interval = setInterval(() => {
	cur++
	if (cur >= 2) {
		clearInterval(interval)
	} else {
		joinRoom(1, 3)
	}
}, 2000)



// const client = new WS('ws://localhost:9090');
// client.on('open', function open() {
//     client.send(JSON.stringify({
//         route: 'roomHandler.joinRoom',
//         params: {
//             roomName: 'onlyOne'
//         }
//     }));
//     client.on('message', (message) => {
//         // console.log(String(message))
//     })
// });



