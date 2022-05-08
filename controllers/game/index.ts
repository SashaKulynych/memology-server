import { v4 as uuidv4 } from 'uuid';

import { mems, getRandomInt, questions } from '../../utils'
import { IRoom } from "../../models"
import { getUsersInRoom } from '../users';

import { IGame, ICard } from './types'

const games: Record<string, IGame> = {}

const host = 'http://localhost:5000/source/mems/'

export const generateGame = (room: IRoom) => {
    const id = uuidv4()
    const data: IGame = {
        id,
        roomId: room.id,
        users: {},
        questions: [...questions],
        game: {
            guestion: '',
            cards: []
        }
    }
    const pictures = [...mems]
    const roomUsers = getUsersInRoom(room.id)
    roomUsers.forEach((user) => {
        const cards: ICard[] = [];
        [0, 1, 2].forEach(() => {
            const i = getRandomInt(0, pictures.length)
            cards.push({
                id: uuidv4(),
                picture: `${host}${pictures[i]}`
            })
            pictures.splice(i, 1)
        })
        data.users[user.id] = {
            cards
        }
    })
    const game = newQuestion(data)
    games[id] = game
    return game
}

export const newQuestion = (data: IGame) => {
    const i = getRandomInt(0, data.questions.length)
    data.game.cards = []
    data.game.guestion = data.questions[i]
    data.questions.splice(i, 1)
    return data
}

export const gameNextMove = (gameId: string) => {
    const game = games[gameId]
    if (game) {
        const data = newQuestion(game)
        return data
    }
}

export const gameMove = (data: {
    gameId: string
    userId: string
    cardId: string
}) => {
    const { gameId, userId, cardId } = data
    const game = games[gameId]
    if (game) {
        const user = game.users[userId]
        if (user) {
            const i = user.cards.findIndex((v) => v.id === cardId)
            if (i !== -1) {
                game.game.cards.push({
                    userId,
                    card: user.cards[i]
                })
                user.cards.splice(i, 1)
            }
        }
    }
    return game
}