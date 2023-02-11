import cluster from 'cluster'
import dotenv from 'dotenv'
import App from './app'
import Master from './master/master'

import log4js from 'log4js'
log4js.configure({
	appenders: {
		normal: { type: 'console' }
	},
	categories: {
		default: {
			appenders: ['normal'],
			level: 'info'
		}
	}
})

dotenv.config()

if (cluster.isMaster) {
	new Master().start()
} else {
	new App().start({ port: Number(process.env.WS_PORT) || 9090 })
}



