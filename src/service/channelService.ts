import App from '../app'
import { IChannelUser, IPushMessage } from '../define/interface/common'

export class ChannelService {
	app: App;
	channelList: { [channelName: string]: Channel }
	constructor(app: App) {
		this.app = app
		this.channelList = {}
	}

	createChannel(name: string): Channel {
		if (!this.channelList[name]) {
			this.channelList[name] = new Channel(this, name)
		}
		return this.channelList[name]
	}

	getChannel(name: string, mk = false): Channel {
		if (mk) return this.createChannel(name)
		return this.channelList[name]
	}

	destroyChannel(name: string) {
		delete this.channelList[name]
	}

	leave(userId: string) {
		for (const name in this.channelList) {
			this.channelList[name].leave(userId)
		}
	}

	broadcast(msg: IPushMessage) {
		for (const name in this.channelList) {
			this.channelList[name].pushMessage(msg)
		}
	}

	getAllChannelUserNum() {
		const map: { [name: string]: number } = {}
		for (const name in this.channelList) {
			map[name] = Object.keys(this.channelList[name].getAllUser()).length
		}
		return map
	}
}

const ST_INITED = 0
const ST_DESTROYED = 1

export class Channel {
	__channelService__: ChannelService;
	name: string;
	userList: { [userId: string]: IChannelUser }
	state: number;
	constructor(channelService: ChannelService, name: string) {
		this.__channelService__ = channelService
		this.name = name
		this.userList = {}
		this.state = ST_INITED
	}

	getAllUser() {
		return this.userList
	}

	add(user: IChannelUser) {
		this.userList[user.userId] = user
	}

	leave(userId: string) {
		delete this.userList[userId]
	}

	destroy() {
		this.state = ST_DESTROYED
		this.__channelService__.destroyChannel(this.name)
	}

	/**频道内推送消息 */
	pushMessage(msg: IPushMessage) {
		msg.type = 'push'
		const sessionList = this.__channelService__.app.connector.clientSessionList
		const sessions = Object.values(this.userList).map(item => sessionList[item.sessionId])
		sessions.forEach(session => session.send(msg)) // 推送消息给用户
	}
}

export default function initChannelService(app: App) {
	return new ChannelService(app)
}