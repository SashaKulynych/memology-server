const fs = require('fs');
const readline = require('readline');

export let mems: string[] = []
export let questions: string[] = []

export const getQuestionsFromTxtFile = async () => {
    const fileStream = fs.createReadStream('./source/questions.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        questions.push(line)
    }
    console.log(`%cQuestions - ${questions.length}`, 'color: #bada55')
}

export const getCardsFromDir = () => {
    const files = fs.readdirSync('./source/mems')
    mems = files
    console.log(`%cMems - ${mems.length}`, 'color: #bada55')
}

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}