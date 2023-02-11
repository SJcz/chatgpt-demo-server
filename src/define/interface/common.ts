export interface IUser {
    userId: string;
    avatar: string;
    username: string;
    /**注册时间 */
    register_time: number;
}

export interface IChannelUser extends IUser {
    sessionId: string | number;
}

/**app 启动配置 */
export interface IStartOptions {
    port: number;
    connector?: string;
}

/**扫描 handler 文件夹生成的配置信息 */
export interface IHandlerMap {
    [handlerName: string]: {
        // eslint-disable-next-line @typescript-eslint/ban-types
        [method: string]: Function;
    } & {
        /**handler 文件路径 */
        filePath: string,
        /**handler 文件单例的方法列表 */
        methodList: string[],
        /**handler 文件的名字 */
        name: string,
    }
}

export interface IBasicMessage {
    type: string;
    data: unknown;
}
export interface IPushMessage extends IBasicMessage {
    route: string;
}

export interface IRequestMessage extends IBasicMessage {
    requestId: number;
    route: string;
}

export interface IResponseMessage extends IBasicMessage {
    requestId: number;
    code: number;
}

export interface IRedisChannelMessage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    route: string;
}

/**房间人数信息 */
export interface IRoomUserNum {
    [name: string]: number
}

/**房间聊天消息数据 */
export interface IRoomMessage {
    room_id: string;
    sender: {
        userId: string;
        avatar: string;
    }
    chat_message: {
        type: string;
        path?: string;
        content?: string;
    }
    send_time: number;
}


