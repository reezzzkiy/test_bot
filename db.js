const {Sequelize} = require('sequelize')


module.exports = new Sequelize(
    'tg_bot',
    'postgres',
    '0000',{
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
    
)