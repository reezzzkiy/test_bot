const TelegrammApi = require('node-telegram-bot-api')
const sequelize = require('./db.js')
const userModel = require('./models.js')

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



const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()

    } catch (e) {
        console.log('что-то не так',e)
    }

    bot.setMyCommands([
        {command:'/start', description:'Начальное приветствие'},
        {command:'/info', description:'Информация'},
        {command:'/game', description:'Игра'},
    ])

    try {
        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id
            const userId = msg.from.username
            if (text === '/start'){
                await userModel.create({chatId,userId})
               return bot.sendMessage(chatId, `Привет`)
            }
            if (text === '/info'){
                const user = await userModel.findOne({chatId})
               return bot.sendMessage(chatId, `Ты ${msg.from.username}, в игре у тебя ${user.right} правильных ответов и ${user.wrong} неправильных ответов`)
            }
            if(text === '/game'){
                return startGame(chatId)
            }
            return bot.sendMessage( chatId, 'Я тебя не понимаю')
            
        })
    } catch (e) {
        return bot.sendMessage(chatId,`что-то пошло не так ${e}`)
    }

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if( data === '/again'){
            return startGame(chatId)
        }
        const user = await userModel.findOne({chatId})

        if( data == chats[chatId]){
            user.right +=1
            await  bot.sendMessage(chatId,`Ты угадал`, againOption)
        } else {
            user.wrong +=1
            await  bot.sendMessage(chatId,`Ты не угадал, цифра была ${chats[chatId]}`, againOption)
        }
        
        bot.sendMessage( chatId, `Ты выбрал ${data}`)
        await user.save()
        console.log(msg)
    })
}
start()