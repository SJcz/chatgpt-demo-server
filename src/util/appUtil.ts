import path from 'path'
import fs from 'fs'
import App from '../app'
import { IHandlerMap } from '../define/interface/common'

class AppUtil {
	static async initHandlerMap(app: App) {
		const scanFiles = AppUtil._scanHandlerFolder()
		app.handlerMap = await AppUtil._generateHandlerMethodMap(app, scanFiles)
	}

	private static _scanHandlerFolder(): string[] {
		const dirPath = path.join(process.cwd(), './src/handler')
		const files = fs.readdirSync(dirPath)
		return files.map(file => {
			const filePath = path.resolve(dirPath, file)
			const stats = fs.statSync(filePath)
			if (stats.isFile() && /\.(js)|\.(jsx)|\.(ts)|\.(tsx)/.test(path.extname(file))) return filePath
		}).filter(file => !!file) as string[]
	}

	private static async _generateHandlerMethodMap(app: App, scanFiles: string[]): Promise<IHandlerMap> {
		if (scanFiles.length === 0) {
			console.warn('there is no any handler file provide')
		}

		const handlerMap: IHandlerMap = {}
		for (const filePath of scanFiles) {
			const handlerName = path.basename(filePath).replace(/\.(js)|\.(jsx)|\.(ts)|\.(tsx)$/, '')

			// eslint-disable-next-line @typescript-eslint/no-var-requires
			let handlerObj = await requireModule(filePath)
			if (typeof handlerObj !== 'function') continue
			handlerObj = handlerObj(app)
			Object.assign(handlerObj, {
				filePath: filePath,
				methodList: [],
				name: handlerName,
			})
			handlerMap[handlerName] = handlerObj

			// 因为 ES6 的类的内部函数无法枚举, 使用该方法获取某个对象的原型的所有属性.
			const names = Object.getOwnPropertyNames(handlerObj.constructor.prototype)
			for (const methodName of names) {
				if (typeof handlerObj[methodName] === 'function' && methodName !== 'constructor') {
					handlerMap[handlerName].methodList.push(methodName)
				}
			}
		}
		return handlerMap
	}

}

// 处理 js 和 ts 的动态引入
async function requireModule(filePath: string) { 
	if (path.extname(filePath) === '.js') {
		return require(filePath)
	} else { 
		// Only URLs with a scheme in: file, data are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'
		filePath = 'file://' + filePath
		return (await import(filePath)).default
	}
}	

export default AppUtil