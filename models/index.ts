const statuses = ['pending', 'in-progress', 'closed'] as const

export type IStatus = typeof statuses[number]

export interface IRoom {
    id: string
    adminId: string
    name: string
    limit: number
    status: IStatus
    gameId: string | null
}

export interface IUser {
    id: string
    name: string
    roomId: string
}

export interface AddUserResponse {
    error?: string,
    user?: IUser
}

export interface ICallbackResponse {
    success: boolean
    error?: string
    result?: any
}

export type ICallback = (response: ICallbackResponse) => any

export interface IRoomData {
    room: IRoom,
    users: IUser[]
}