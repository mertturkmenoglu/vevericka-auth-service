const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');


dotenv.config();


const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');


app.use(bodyParser.json());
app.use(morgan('[:date[web]] || :method :url  || Status: :status || Response time: :response-time ms'))
app.use(cors())


const MONGOOSE_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_CONNECTION, MONGOOSE_OPTIONS, () => {
    console.log('Connected to MongoDB database');
});


app.get('/api', (req, res) => {
    return res.json({
        message: 'Vevericka Auth Service: GET /'
    })
});


app.use('/auth', authRoute);
app.use('/posts', postsRoute);

app.get('*', (req, res) => {
    res.status(404).send('Not found')
})

const PORT = process.env.PORT || 4545;
const server = app.listen(PORT, () => {
    console.log(`Server started listening at port ${PORT}`);
});

module.exports = server
