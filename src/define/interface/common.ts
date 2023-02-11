export interface IUser {
    userId: string;
    /**注册时间 */
    register_time: number;
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

export interface IRequestMessage extends IBasicMessage {
    requestId: number;
    route: string;
}

export interface IResponseMessage extends IBasicMessage {
    requestId: number;
    code: number;
}


