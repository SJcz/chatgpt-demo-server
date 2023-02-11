/** redis 的 channel 事件对应的消息路由枚举 */
export const enum RedisMessageRoute {
    ROOM_JOIN = 'room.join',
    ROOM_CHAT = 'room.chat',
    ROOM_LEAVE = 'room.leave',
}

/**进程间消息路由枚举 */
export const enum ProcessMessageRoute {
    ROOM_PEOPLE_NUM = 'room.people.num',
    ROOM_PEOPLE_NUM_REPORT = 'room.people.num.report'
}

/**头像文件存放的基础文件夹, Dockerfile 中也是指定该文件夹 */
export const AVATAR_BASE_FOLDER = '/src/app/avatars'