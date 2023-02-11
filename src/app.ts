import events from 'events'
import { v1 } from 'uuid'
import WSConnector from './connector/ws.connector'
import WSSession from './connector/ws.session'
import { IHandlerMap, IStartOptions, IUser, IRequestMessage, IBasicMessage } from './define/interface/common'
import log4js from 'log4js'
import AppUtil from './util/appUtil'
import initChatgptConversationService, { ChatgptConversationService } from './service/chatgptConversationService'
const logger = log4js.getLogger()

class App extends events.EventEmitter {
	handlerMap!: IHandlerMap;
	connector!: WSConnector;
	chatgptConversationService!: ChatgptConversationService

	start(opts: IStartOptions) {
		opts = opts || {}
		this.connector = this.getScoketConnector(opts)
		this.connector.start(opts)

		this.chatgptConversationService = initChatgptConversationService(this)

		AppUtil.initHandlerMap(this)

		this._initEvents()
	}

	_initEvents() {
		this.connector.on('connection', this.handleConnection.bind(this))
	}

	async handleConnection(session: WSSession) {
		// 因为不需要登录, 所以连接上直接给一个用户Id
		const userId = v1()
		const user: IUser = {
			userId,
			register_time: Date.now()
		}
		session.set('userId', userId)
		session.set('user', user)
		session.on('message', this.handleClientMessage.bind(this, session))
		session.on('connect-error', () => { // 自定义的错误事件
			this.chatgptConversationService.destroyConversation(session.userId)
		})
		logger.info(`session=${session.id} userId=${session.get('userId')} 连接到进程 ${process.pid}`)
	}

	/**处理客户端的请求消息 */
	async handleClientMessage(session: WSSession, msg: IRequestMessage) {
		// logger.info(`收到 ${session.userId} 的消息: ${JSON.stringify(msg)}`)
		if (!msg.route) {
			logger.info(`消息 route=${msg.route} 路由无效, 未知消息不处理`)
			if (msg.type === 'request') session.send(<IBasicMessage>{ type: 'response', code: 501, data: '服务器收到未知消息', requestId: msg.requestId })
			return
		}
		const [handlerName, method] = msg.route.split('.')
		if (!this.handlerMap[handlerName] || typeof this.handlerMap[handlerName][method] !== 'function') {
			logger.info(`找不到 handlerName=${handlerName} method=${method} 来处理该消息`)
			if (msg.type === 'request') session.send(<IBasicMessage>{ type: 'response', code: 404, data: '找不到对应的 handler', requestId: msg.requestId })
			return
		}
		try {
			await this.handlerMap[handlerName][method](msg || {}, session)
		} catch (err) {
			logger.error(err)
			if (msg.type == 'request') return session.send(<IBasicMessage>{ type: 'response', code: 500, data: '服务器错误', requestId: msg.requestId })
		}
	}

	getScoketConnector(opts: IStartOptions) {
		if (!opts.connector) return this._getDetaultScocketConnector()
		return this._getDetaultScocketConnector()
	}

	_getDetaultScocketConnector() {
		return new WSConnector()
	}
}

export default App


