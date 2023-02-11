import cluster, { Worker } from 'cluster'
import os from 'os'
import HttpServer from './http-server'
import log4js from 'log4js'
const logger = log4js.getLogger()

class Master {
	httpServer!: HttpServer

	start() {
		this.initProcessEvent()
		this.startAllWorkers()
		this.startHttpServer()
	}

	initProcessEvent() {
		process.on('exit', () => {
			for (const id in cluster.workers) {
				cluster.workers[id] && (<Worker>cluster.workers[id]).kill()
			}
		})
	}

	startAllWorkers() {
		const cpus = os.cpus()
		const minWorkerNum = cpus.length - 1 <= 1 ? 1 : cpus.length - 1
		for (let i = 0; i < minWorkerNum; i++) {
			this.createWorker()
		}
	}

	createWorker() {
		const worker = cluster.fork()
		worker.on('exit', (code: number, signal: string) => {
			logger.info(`worker ${worker.id}, process ${worker.process.pid} exit. code=${code} signal=${signal}`)
			delete cluster.workers[worker.id]
			this.createWorker()
		})
		worker.on('error', (error: Error) => {
			logger.info(`worker ${worker.id}, process ${worker.process.pid} error`)
			logger.error(error)
			delete cluster.workers[worker.id]
			this.createWorker()
		})
		worker.on('disconnect', () => {
			logger.info(`worker ${worker.id}, process ${worker.process.pid} disconnect`)
			delete cluster.workers[worker.id]
			this.createWorker()
		})
		logger.info(`create worker ${worker.id}, process ${worker.process.pid} successfully!`)
	}

	startHttpServer() {
		this.httpServer = new HttpServer()
		this.httpServer.start()
	}
}

export default Master