const mongoose       = require('mongoose');
const { logSuccess } = require(`./logs.js`); 

const DB_USER     = 'dbtests',
      DB_PASSWORD = 'dbtests69';

module.exports = () => {
    mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@ds229418.mlab.com:29418/cardsagainsthumanity`, { useNewUrlParser: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        logSuccess(`Created a connection to the database!`);
    });
}