import { AddUserResponse, IRoom, IUser } from "../../models";

const users: Record<string, IUser> = {};

export const addUser = ({ id, name, room }: {
    id: string,
    name: string,
    room: IRoom
}): AddUserResponse => {
    const data = {
        name: name.trim()
    }
    const roomUsers = getUsersInRoom(room.id)
    const nameAlreadyExist = roomUsers.find((v) => v.name === data.name)
    if (nameAlreadyExist) {
        return {
            user: nameAlreadyExist
        }
    }
    const user: IUser = { id, name, roomId: room.id };
    users[user.id] = user
    return { user };
}

export const removeUser = (id: string) => {
    const user = users[id]
    if (user) {
        delete users[id]
        return user
    }
}

export const getUser = (id: string) => users[id];

export const getUsersInRoom = (roomId: string) => Object.values(users).filter((v) => v.roomId === roomId)