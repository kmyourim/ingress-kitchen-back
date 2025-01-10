const mongoose = require('mongoose')

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR; 
const mongoURI = "mongodb://" + GUESTBOOK_DB_ADDR + "/guestbook"

const db = mongoose.connection;

db.on('disconnected', () => {
    console.error(`Disconnected: unable to reconnect to ${mongoURI}`)
    throw new Error(`Disconnected: unable to reconnect to ${mongoURI}`) 
})
db.on('error', (err) => {
    console.error(`Unable to connect to ${mongoURI}: ${err}`);
});

db.once('open', () => {
  console.log(`connected to ${mongoURI}`);
});

const connectToMongoDB = async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        connectTimeoutMS: 2000,
        reconnectTries: 1
    })
};

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    tel: { type: String, required: true },
    rating: {type: String, required: true },
    ask: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    timestamps: {}
});

const messageModel = mongoose.model('Message', messageSchema);

const construct = (params) => {
    const name = params.name
    const body = params.body
    const date = params.date
    const address = params.address
    const tel = params.tel
    const rating = params.rating
    const ask = params.ask
    const link = params.link
    const image = params.image
    const message = new messageModel({ name: name, body: body, date: date, address: address, tel: tel, rating: rating, ask: ask, link: link, image: image })
    return message
};

const save = (message) => {
    console.log("saving message....")
    message.save((err) => {
        if (err) { throw err }
    })
};

// Constructs and saves message
const create = (params) => {
    try {
        const msg = construct(params)
        const validationError = msg.validateSync()
        if (validationError) { throw validationError }
        save(msg)
    } catch (error) {
        throw error
    }
}

module.exports = {
    create: create,
    messageModel: messageModel,
    connectToMongoDB: connectToMongoDB
}

