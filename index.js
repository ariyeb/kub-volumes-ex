const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());

app.use('/error', (req, res) => {
    res.status(500).send({ error: 'Server crushed' });
    process.exit(1);
});

const filePath = path.join(__dirname, "data", "messages.txt");

app.post('/add-message', (req, res) => {
    const newMessage = req.body.message?.trim();
    if (newMessage.length === 0) res.status(422).send({ error: "The message is missing" });

    fs.appendFile(filePath, newMessage + '%%%', (err) => {
        if (err) return res.status(500).send({ error: "Message didn't saved" });
        res.send({ message: "Message saved" });
    });
});

app.get('/messages', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.writeFile(filePath, "", () => { });
                return res.send({ messages: [] });
            }
            return res.status(500).send({ error: "Failed to fetch messages" });
        }
        const messages = data.toString().split("%%%");
        if (messages.length > 0) messages.pop();
        res.send({ messages });
    });
});

app.listen(3000, () => console.log("Server connected, port 3000"));