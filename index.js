const TelegrammApi = require('node-telegram-bot-api')


const token = "6712516867:AAHoJvvKjYt4yKwpRxqab3iy48PfDeFKV7o"
const {gameOption, againOption} = require('./option')
const bot = new TelegrammApi(token, {polling: true})

const chats = {}

const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `отгадай цифру от 0 до 9`)
            const randomNumber = Math.floor(Math.random()*10)
            chats[chatId] = randomNumber
            console.log(`число ${randomNumber}`)
            await bot.sendMessage(chatId,`отгадывай`, gameOption)
}



const start = () => {
    bot.setMyCommands([
        {command:'/start', description:'Начальное приветствие'},
        {command:'/info', description:'Информация'},
        {command:'/game', description:'Игра'},
    ])
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if (text === '/start'){
    
           return bot.sendMessage(chatId, `Привет`)
        }
        if (text === '/info'){
           return bot.sendMessage(chatId, `Ты ${msg.from.username}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage( chatId, 'Я тебя не понимаю')
        
    })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if( data === '/again'){
            return startGame(chatId)
        }
        if( data === chats[chatId]){
            return await bot.sendMessage(chatId,`Ты угадал`, againOption)
        } else {
            return await bot.sendMessage(chatId,`Ты не угадал, цифра была ${chats[chatId]}`, againOption)
        }
        bot.sendMessage( chatId, `Ты выбрал ${data}`)
        console.log(msg)
    })
}
start()