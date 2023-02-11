import WS from 'ws'

/**用于测试！！！！ */
function testConnect(min: number, max: number) {
	for (let i = min; i < max; i++) {
		const client = new WS('ws://127.0.0.1:9090/websocket')
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
		})
	}
}

// joinRoom(1, 50)

testConnect(1, 3)




