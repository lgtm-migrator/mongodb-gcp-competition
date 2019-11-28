const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const port = 8080;

// Hides the header that exposes Express as a server
app.disable('x-powered-by');

// Setup the engine using express handlebars
app.engine(
  'hbs',
  exphbs({
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');
// To disable the use of layouts. See https://github.com/ericf/express-handlebars#layouts.
app.locals.layout = false;

app.set('views', 'src/views');
app.use('/assets', express.static('assets'));

app.get('/', (request, response, next) => response.status(200).render('index'));
app.get('*', (request, response, next) => next(new Error('PAGE_NOT_FOUND')));

app.use((error, request, response, next) => {
  // see https://expressjs.com/en/guide/error-handling.html
  if (response.headersSent) {
    return next(error);
  }

  if (error.message === 'PAGE_NOT_FOUND') {
    response.locals.title = 'Page not found';
    response.locals.content = `Can't find ${request.path}`;
    response.status(404);
  } else {
    response.locals.title = 'Error';
    response.locals.content = error.message;
    response.status(500);
  }

  response.render('other');
});

app.listen(port, error => {
  if (error) {
    return console.error(error.message);
  }
  
  console.info(`Listening on port ${port}`);
});