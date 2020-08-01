// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const videoRoutes = require('./src/routes/video');
const categoryRoutes = require('./src/routes/category');
const userRoutes = require('./src/routes/user');
const projectRoutes = require('./src/routes/projects');
const KEYS = require('./config/keys');
const middlewarePassport = require('./src/middlewares/passport');

const app = express();

mongoose.connect(process.env.MONGODB_URI || KEYS.mongoURI, {useNewUrlParser: true, useFindAndModify: false}).then(() => {
    console.log("MongoDb");
}).catch((err) => {
    console.log(err)
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
middlewarePassport(passport);

app.use(passport.initialize());
middlewarePassport(passport);

app.use('/api/video', videoRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const port = process.env.PORT || 5000;

app.listen(port, (() => console.log(`Server started on port ${port}`)));

