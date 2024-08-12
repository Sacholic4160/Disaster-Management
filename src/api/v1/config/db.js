const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('Real-Time-Location','postgres',
    'Fablo@143', {
        host: 'localhost',
        dialect: 'postgres',
        logging: false // Set to false to disable logging
    }
)

module.exports = sequelize