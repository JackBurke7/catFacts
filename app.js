var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.get('/cats/fact', async function (req, res, next) {
  try {
    var response = await axios.get('https://catfact.ninja/facts');

    var catFacts = response.data.data;
    var randomIndex = Math.floor(Math.random() * catFacts.length); 
    var randomCatFact = catFacts[randomIndex].fact; 

    res.render('cat/fact', { catFact: randomCatFact });
  } catch (error) {
    res.render('error', { message: 'Failed to fetch a cat fact' });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/views/cat', express.static('views/cat'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;
