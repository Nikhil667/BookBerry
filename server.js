if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const bodyParser = require('body-parser');

//importing router
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts);
app.use(express.static('public'));

//body-parser to take value from the input fields
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//connecting with database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, })

//checking if we are connected to our database
const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to mongoose"));

//importing router
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

app.listen(process.env.PORT || 3000);