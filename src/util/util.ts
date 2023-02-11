import fs from 'fs-extra'
import crypto = require('crypto')
import { AVATAR_BASE_FOLDER } from '../define/interface/constant'

/**获得一个随机头像 */
export async function getRandomAvatar() {
	return ''
	const files = await fs.readdir(AVATAR_BASE_FOLDER)
	const index = Math.floor(Math.random() * files.length)
	return process.env.HTTP_DOMAIN + `/avatar/${files[index]}`
}

/**
	 * 验证 token 是否正确
	 * 这里只是一个案例, 要求可以端用于验证的明文格式为 a|b|c
	 * TODO 
	 * @param token 
	 */
export function verifyToken(token: string) {
	const decrypted = decryptToken(token)
	const arr = decrypted.split('|')
	if (Date.now() - +arr[2] <= 24 * 60 * 60 * 1000 ||
		+arr[2] - Date.now() <= 24 * 60 * 60 * 1000) {
		return arr.length === 3
	}
	return false

}

function decryptToken(token: string): string {
	const decipher = crypto.createDecipheriv('aes-128-ecb', process.env.SECRET_KEY as string, '')
	let decrypted = decipher.update(Buffer.from(token, 'base64').toString('hex'), 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	return decrypted
}