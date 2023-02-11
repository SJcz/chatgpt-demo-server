import App from '../app'

interface ChatgptConItem {
    conversationId: string | undefined,
    parentMessageId: string
}

export class ChatgptConversationService {
	app: App;
	conversationCache: { [sessionUserId: string]: ChatgptConItem }
	constructor(app: App) {
		this.app = app
		this.conversationCache = {}
	}

	createConversation(sessionUserId: string) {
		if (!this.conversationCache[sessionUserId]) {
			this.conversationCache[sessionUserId] = {
				conversationId: '',
				parentMessageId: ''
			}
		}
		return this.conversationCache[sessionUserId]
	}

	getConversation(sessionUserId: string): ChatgptConItem {
		return this.conversationCache[sessionUserId]
	}

	destroyConversation(sessionUserId: string) {
		delete this.conversationCache[sessionUserId]
	}

	updateConversation(sessionUserId: string, data: ChatgptConItem) {
		this.conversationCache[sessionUserId] = data
	}
}

export default function initChatgptConversationService(app: App) {
	return new ChatgptConversationService(app)
}