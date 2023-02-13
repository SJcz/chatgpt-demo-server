import App from '../app'
import WSSession from '../connector/ws.session'
import { IRequestMessage } from '../define/interface/common'
import { ChatpgtRobot } from '../util/chatgpt-robot'

class ChatHandler {
	app: App;
	chatRobot: ChatpgtRobot
	constructor(app: App) {
		this.app = app
		this.chatRobot = new ChatpgtRobot(app)
	}

	async chat(message: IRequestMessage, session: WSSession) {
		if (!message.data) return
		await this.chatRobot.ask(message, session)
		return 'ok'
	}
}

module.exports = (app: App) => {
	return new ChatHandler(app)
}


