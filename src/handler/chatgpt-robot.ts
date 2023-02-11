import { ChatGPTAPI } from 'chatgpt'
import App from '../app'
import WSSession from '../connector/ws.session'
import log4js from 'log4js'
import { IBasicMessage, IRequestMessage, IResponseMessage } from '../define/interface/common'
const logger = log4js.getLogger()

export class ChatpgtRobot {
    app: App
    robot: ChatGPTAPI
    constructor(app: App) {
        this.app = app
        this.robot = new ChatGPTAPI({
            apiKey: process.env.CHATGPT_KEY as string
        })
    }

    async ask({ requestId, data: content }: IRequestMessage, session: WSSession) {
        logger.info(`${session.userId}:${requestId}: ${content}`)
        const cacheItem = this.app.chatgptConversationService.getConversation(session.userId)
        const res = await this.robot.sendMessage(content as string, {
            promptPrefix: '',
            // print the partial response as the AI is "typing"
            onProgress: (partialResponse) => {
                session.send(<IResponseMessage>{ 
                    type: 'response', 
                    code: 0, 
                    data: partialResponse.text, 
                    requestId: requestId 
                })
            },
            conversationId: cacheItem?.conversationId,
            parentMessageId: cacheItem?.parentMessageId
        })
        this.app.chatgptConversationService.updateConversation(session.userId, {
            conversationId: res.conversationId,
            parentMessageId: res.id
        })
    }

}


