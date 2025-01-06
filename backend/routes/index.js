const express = require('express');
const bodyParser = require('body-parser');
const Message = require('./messages')

const router = express.Router();
router.use(bodyParser.json());

// Handles GET requests to /messages
router.get('/messages', (req, res) => {
    console.log(`received request: ${req.method} ${req.url}`)

    // Query for messages in descending order
    try {
        Message.messageModel.find({}, null, { sort: { '_id': -1 } }, (err, messages) => {
            let list = []
            if (messages.length > 0) {
                messages.forEach((message) => {
                    if (message.name && message.body && message.date && message.address && message.tel && message.rating && message.ask && message.link && message.image ) {
                        list.push({ 'name': message.name, 'body': message.body, 'date': message.date, 'address': message.address, 'tel': message.tel, 'rating': message.rating, 'ask': message.ask, 'link': message.link, 'image': message.image, 'timestamp': message._id.getTimestamp() })
                    }
                });
            }
            res.status(200).json(list)
        });
    } catch (error) {
        res.status(500).json(error)
    }
});

// Handles POST requests to /messages
router.post('/messages', (req, res) => {
    try {
    const { name, body, date, address, tel, rating, ask, link, image } = req.body
    if(!name || name.length === 0) {
        return res.status(400).send("Name is not specified")
    }
    if(!body || body.length === 0) {
        return res.status(400).send("Body is not specified")
    }
    if(!date || date.length === 0) {
        return res.status(400).send("Date is not specified")
    }
    if(!address || address.length === 0) {
        return res.status(400).send("Address is not specified")
    }
    if(!tel || tel.length === 0) {
        return res.status(400).send("Tel is not specified")
    }
    if(!rating || rating.length === 0) {
        return res.status(400).send("Rating is not specified")
    }
    if(!ask || ask.length === 0) {
        return res.status(400).send("Ask is not specified")
    }
    if(!link || link.length === 0) {
        return res.status(400).send("Link is not specifeid")
    }
    if(!image || image.length === 0) {
        return res.status(400).send("Image is not specifeid")
    }
        Message.create(({name: req.body.name, body: req.body.body, date: req.body.date, address: req.body.address, tel: req.body.tel, rating: req.body.rating, ask: req.body.ask, link: req.body.link, image: req.body.image}))
        res.status(200).send()
    } catch (err) {
        if (err.name == "ValidationError") {
            console.error('validation error: ' + err)
            res.status(400).json(err)
        } else {
            console.error('could not save: ' + err)
            res.status(500).json(err)
        }
    }
});

module.exports = router;
