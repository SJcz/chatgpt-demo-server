import express, { Express } from 'express'
import log4js from 'log4js'
const logger = log4js.getLogger()

export default class HttpServer {
  private app!: Express;
  start() {	
  	this.app = express()
  	this.app.use(express.json())
		
  	// 支持跨域访问
  	this.app.all('*', function (req, res, next) {
  		res.header('Content-Type', 'application/json')
  		res.header('Access-Control-Allow-Origin', '*')
  		res.header('Access-Control-Allow-Headers', 'origin,accept,content-type')
  		if (req.method.toUpperCase() === 'OPTIONS') {
  			res.end()
  		} else {
  			next()
  		}
  	})
		
  	// 处理浏览器 /favicon.ico 请求
  	this.app.get('/favicon.ico', (req, res) => res.end('favicon.ico'))
		
  	this.app.listen(process.env.HTTP_PORT, () => {
  		logger.info(`HTTP服务器启动 PROT=${process.env.HTTP_PORT}`)
  	})
  }
}