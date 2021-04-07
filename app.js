const express = require('express');
const config = require('./config.json');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = config.port || 5000;

const app = express();
const corsOptions = {
    origin: config['front-endURI'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
app.use(express.json({ extended: true }));

app.use('/api/authentication', require('./routes/authentication.router'));
app.use('/api/user', require('./routes/user.router'));
app.use('/api/publication', require('./routes/publication.router'));
app.use('/api/friend', require('./routes/friend.router'));



async function initializeServer() {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => { console.log(`server on ${PORT}`); })
    } catch (e) {
        console.log(e.message);
    }

}
initializeServer();



