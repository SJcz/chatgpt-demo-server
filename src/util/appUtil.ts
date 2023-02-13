import path from 'path'
import fs from 'fs'
import App from '../app'
import { IHandlerMap } from '../define/interface/common'

class AppUtil {
	static initHandlerMap(app: App) {
		const scanFiles = AppUtil._scanHandlerFolder()
		app.handlerMap = AppUtil._generateHandlerMethodMap(app, scanFiles)
	}

	private static _scanHandlerFolder(): string[] {
		const dirPath = path.join(process.cwd(), './src/handler')
		const files = fs.readdirSync(dirPath)
		return files.map(file => {
			const filePath = path.resolve(dirPath, file)
			const stats = fs.statSync(filePath)
			if (stats.isFile() && /\.(js)|(jsx)|(ts)|(tsx)/.test(path.extname(file))) return filePath
		}).filter(file => !!file) as string[]
	}

	private static _generateHandlerMethodMap(app: App, scanFiles: string[]): IHandlerMap {
		if (scanFiles.length === 0) {
			console.warn('there is no any handler file provide')
		}

		const handlerMap: IHandlerMap = {}
		for (const filePath of scanFiles) {
			const handlerName = path.basename(filePath).replace(/\.(js)|(jsx)|(ts)|(tsx)$/, '')

			// eslint-disable-next-line @typescript-eslint/no-var-requires
			let handlerObj = require(filePath)
			if (typeof handlerObj !== 'function') continue
			handlerObj = handlerObj(app)
			Object.assign(handlerObj, {
				filePath: filePath,
				methodList: [],
				name: handlerName,
			})
			handlerMap[handlerName] = handlerObj

			for (const methodName in handlerObj) {
				if (typeof handlerObj[methodName] === 'function') {
					handlerMap[handlerName].methodList.push(methodName)
				}
			}
		}
		return handlerMap
	}

}

export default AppUtil