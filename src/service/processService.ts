// import App from '../app'
// import { IBasicMessage, IPushMessage, IRoomUserNum } from '../define/interface/common'
// import { ProcessMessageRoute } from '../define/interface/constant'
// // import roomManager from '../manager/roomManager'
// import log4js from 'log4js'
// const logger = log4js.getLogger()

// interface IProcessMemory {
// 	heapTotal: number;
// 	heapUsed: number;
// 	rss: number;
// }

// export class ProcessService {
// 	app: App
// 	memory!: IProcessMemory
// 	constructor(app: App) {
// 		this.app = app
// 		this.memory = {
// 			heapTotal: -1,
// 			heapUsed: -1,
// 			rss: -1
// 		}
// 		this.initProcessEvent()
// 		this.initProcessInterval()
// 	}

// 	initProcessEvent() {
// 		process.on('message', (message: IBasicMessage) => {
// 			if (message.type == 'push') {
// 				switch ((<IPushMessage>message).route) {
// 					case ProcessMessageRoute.ROOM_PEOPLE_NUM:
// 						return this.handlerPushMessage_ROOM_PEOPLE_NUM(<IPushMessage>message)
// 					default:
// 						return this.handlerPushMessage_NO_MATCH(<IPushMessage>message)
// 				}
// 			}
// 		})

// 		process.on('disconnect', () => {
// 			logger.error(`子进程 process=${process.pid} 跟父进程断开 IPC 通道`)
// 			this.app.connector.close(() => {
// 				process.exit(-1)
// 			})
// 		})

// 		process.on('exit', (code: number) => {
// 			logger.error(`子进程 process=${process.pid} 退出 code=${code}`)
// 		})
// 	}

// 	initProcessInterval() {
// 		setInterval(this._recordProcessMemory.bind(this), 30000)
// 		setInterval(() => {
// 			if (process.send) {
// 				process.send({
// 					type: 'push',
// 					route: ProcessMessageRoute.ROOM_PEOPLE_NUM_REPORT,
// 					data: this.app.channelService.getAllChannelUserNum()
// 				})
// 				process.send({
// 					type: 'pull',
// 					route: ProcessMessageRoute.ROOM_PEOPLE_NUM,
// 					data: null
// 				})
// 			}
// 		}, 5000)
// 	}

// 	handlerPushMessage_ROOM_PEOPLE_NUM(message: IPushMessage) {
// 		roomManager.updateAllRoomUserNum(<IRoomUserNum>message.data)
// 	}

// 	handlerPushMessage_NO_MATCH(message: IPushMessage) {
// 		logger.error(`子进程 process=${process.pid} 收到无法处理的父进程消息, route=${message.route}`)
// 	}

// 	_recordProcessMemory() {
// 		const userIds = Object.values(this.app.connector.clientSessionList).map(session => session.userId)
// 		const memoryUsage = process.memoryUsage()
// 		const [heapTotal, heapUsed, rss] = [Math.trunc(memoryUsage.heapTotal / 1024 / 1024), Math.trunc(memoryUsage.heapUsed / 1024 / 1024), Math.trunc(memoryUsage.rss / 1024 / 1024)]
// 		Object.assign(this.memory, { heapTotal, heapUsed, rss })
// 		logger.info(`进程 ${process.pid} 当前维持了 ${userIds.length} 个连接, 当前申请内存=${heapTotal} M  使用内存=${heapUsed} M , rss =${rss} M`)
// 	}
// }

// export default function initProcessService(app: App) {
// 	return new ProcessService(app)
// }