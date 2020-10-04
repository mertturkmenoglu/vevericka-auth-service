const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


dotenv.config();


const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');


app.use(bodyParser.json());


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


const PORT = process.env.PORT || 4545;
app.listen(PORT, () => {
	console.log(`Server started listening at port ${PORT}`);
});
