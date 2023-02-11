import App from '../app'

import redis from 'redis'
import { promisify } from 'util'
import { IRedisChannelMessage } from '../define/interface/common'
import log4js from 'log4js'
const logger = log4js.getLogger()

export class RedisService {
	app: App;
	subscriber: redis.RedisClient;
	publisher: redis.RedisClient;

	getAsync: (arg1: string) => Promise<string | null>;
	setAsync: (arg1: string, arg2: string) => Promise<unknown>;

	constructor(app: App) {
		this.app = app
		this.subscriber = redis.createClient({
			host: process.env.REDIS_HOST || '127.0.0.1',
			port: Number(process.env.REDIS_PORT) || 6379,
		})
		this.publisher = redis.createClient({
			host: process.env.REDIS_HOST || '127.0.0.1',
			port: Number(process.env.REDIS_PORT) || 6379,
		})
		this.getAsync = promisify(this.subscriber.get).bind(this.subscriber)
		this.setAsync = promisify(this.subscriber.set).bind(this.subscriber)
		this._initEvents()
	}

	_initEvents() {
		this.subscriber.subscribe('channel')
		this.subscriber.on('message', (category: string, message: string) => {
			if (category === 'channel') this.app.emit('channel', <IRedisChannelMessage>JSON.parse(message))
		})
		this.subscriber.on('error', (error) => {
			logger.error(error)
		})
	}

	publish(category: string, msg: IRedisChannelMessage) {
		this.publisher.publish(category, JSON.stringify(msg))
	}
}

export default function initRedisService(app: App) {
	return new RedisService(app)
}