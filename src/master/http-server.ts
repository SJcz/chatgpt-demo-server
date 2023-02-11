import express, { Express } from 'express'
import fs from 'fs-extra'
import { AVATAR_BASE_FOLDER } from '../define/interface/constant'
import STS from 'qcloud-cos-sts'
import log4js from 'log4js'
import { verifyToken } from '../util/util'
const logger = log4js.getLogger()

// COS配置参数
const config = {
	secretId: process.env.COS_SECRET_ID || '',
	secretKey: process.env.COS_SECRET_KEY || '',
	proxy: '',
	durationSeconds: 7200,

	// 放行判断相关参数
	bucket: 'onlyone-chat-1304022868',
	region: 'ap-guangzhou',
	allowPrefix: '*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
	// 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
	allowActions: [
		// 简单上传
		'name/cos:PutObject',
		'name/cos:PostObject',
		// 分片上传
		'name/cos:InitiateMultipartUpload',
		'name/cos:ListMultipartUploads',
		'name/cos:ListParts',
		'name/cos:UploadPart',
		'name/cos:CompleteMultipartUpload',
		//下载操作 
		'name/cos:GetObject'
	],
}

export default class HttpServer {
  private app!: Express;
  start() {
	logger.info(process.env)
  	// fs.ensureDirSync(AVATAR_BASE_FOLDER)
		
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
		
  	// 建立静态资源服务
  	this.app.use('/avatar', express.static(AVATAR_BASE_FOLDER))
		
  	// 处理浏览器 /favicon.ico 请求
  	this.app.get('/favicon.ico', (req, res) => res.end('favicon.ico'))
		
  	// 临时密钥接口
  	this.app.get('/sts', verifyTokenMiddleware, function (req, res) {
  		// 获取临时密钥
  		const shortBucketName = config.bucket.substr(0 , config.bucket.lastIndexOf('-'))
  		const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'))
  		const policy = {
  			'version': '2.0',
  			'statement': [{
  				'action': config.allowActions,
  				'effect': 'allow',
  				'principal': {'qcs': ['*']},
  				'resource': [
  					'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
  				],
  			}],
  		}
  		STS.getCredential({
  			secretId: config.secretId,
  			secretKey: config.secretKey,
  			proxy: config.proxy,
  			durationSeconds: config.durationSeconds,
  			policy: policy,
  		}, function (err, tempKeys) {
  			const result = JSON.stringify(err || tempKeys) || ''
  			res.send(result)
  		})
  	})
		
  	this.app.listen(process.env.HTTP_PORT, () => {
  		logger.info(`静态资源服务器启动 PROT=${process.env.HTTP_PORT}, 资源目录: ${AVATAR_BASE_FOLDER}`)
  	})
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyTokenMiddleware = function (req: any, res: any, next: () => void) {
	const token = req.query.token
	if (!token) return res.status(401).end('Need Token')
	if (verifyToken(token)) return next()
	res.status(403).end('Unauthorized')
}