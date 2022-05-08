import { v4 as uuidv4 } from 'uuid';
import { IRoom, IStatus } from '../../models';

const rooms: Record<string, IRoom> = {};

export const addRoom = ({ room }: {
  room: Omit<IRoom, "id" | "status" | "gameId">
}): IRoom => {
  const { name, limit, adminId } = room;
  const id = uuidv4();
  const newRoom: IRoom = {
    id: id,
    adminId,
    name: name.trim().toLowerCase(),
    limit,
    status: 'pending',
    gameId: null
  }
  rooms[id] = newRoom;
  return newRoom;
};

export const removeRoom = (id) => {
  delete rooms[id];
  return rooms;
};

export const getRoom = (id) => rooms[id];

export const changeRoomStatus = (id: string, status: IStatus) => {
  const room = rooms[id]
  if (room) {
    room.status = status
    return room
  } else {
    return
  }
}