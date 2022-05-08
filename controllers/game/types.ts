export interface IGame {
    id: string
    roomId: string
    questions: string[]
    users: Record<string, {
        cards: ICard[]
    }>
    game: {
        guestion: string
        cards: {
            userId: string,
            card: ICard
        }[]
    }
}

export interface ICard {
    id: string
    picture: string
}