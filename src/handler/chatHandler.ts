import App from '../app'
import WSSession from '../connector/ws.session'
import { IRequestMessage, IRoomMessage } from '../define/interface/common'
import log4js from 'log4js'
import { ChatpgtRobot } from './chatgpt-robot'
const logger = log4js.getLogger()

class ChatHandler {
	app: App;
	chatRobot: ChatpgtRobot
	constructor(app: App) {
		this.app = app
		this.chatRobot = new ChatpgtRobot(app)
		// this.chatRobot.init()
	}

	async chat(message: IRequestMessage, session: WSSession) {
		if (!message.data) return
		await this.chatRobot.ask(message, session)
		return 'ok'
	}
}

interface IChatRequestBody {
	room_id: string;
	chat_message: {
		type: string;
		path?: string;
		content?: string;
	};
}

module.exports = (app: App) => {
	return new ChatHandler(app)
}


