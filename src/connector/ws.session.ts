import events from 'events'
import WebSocket from 'ws'
import { IBasicMessage, IUser } from '../define/interface/common'

export default class WSSession extends events.EventEmitter {
	id: number;
	socket: WebSocket
	/**socket 是否存活 */
	isAlive: boolean

	map: Map<string, unknown>;

	constructor(id: number, socket: WebSocket) {
		super()
		this.id = id
		this.socket = socket
		this.isAlive = true
		this.map = new Map()
		this._initEvents()
	}

	_initEvents() {
		this.socket.on('message', (message: Buffer | string) => {
			this.emit('message', JSON.parse(message.toString()))
		})
		this.socket.on('close', (code: number, reason: string) => {
			this.isAlive = false
			this.emit('close', code, reason)
		})
		this.socket.on('error', (error: Error) => {
			this.isAlive = false
			this.emit('error', error)
		})
		this.socket.on('ping', (data: Buffer | string) => {
			this.socket.pong(data)
		})
		this.socket.on('pong', () => {
			this.isAlive = true
		})
	}

	terminate() {
		this.socket.terminate()
	}

	ping() {
		this.socket.ping()
	}

	send(msg: IBasicMessage | string) {
		if (!this.isAlive) return
		if (typeof msg !== 'string') msg = JSON.stringify(msg)
		this.socket.send(msg)
	}

	set(key: string, value: unknown) {
		this.map.set(key, value)
	}

	get<T>(key: string): T {
		return this.map.get(key) as T
	}

	get userId(): string {
		return this.map.get('userId') as string
	}

	get user(): IUser {
		return this.map.get('user') as IUser
	}
}


