const express = require('express');
const app = express();

const hostname = '0.0.0.0';
const port = 3000;

const mongoose = require('mongoose');

const mongooseParams = {
  useUnifiedTopology : true,
  useNewUrlParser: true,
  useCreateIndex: true
}
mongoose.connect('mongodb://mongo/apinodeipssi', mongooseParams); // docker (mongo = nom du container)
// mongoose.connect('mongodb://localhost:27017/apinodeipssi', mongooseParams); // windows sans docker

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json())

const postRoute = require('./api/routes/postRoute');
const commentRoute = require('./api/routes/commentRoute');
const userRoute = require('./api/routes/userRoute');
postRoute(app);
commentRoute(app);
userRoute(app);

if(!module.parent){
  app.listen(port, hostname);
}

module.exports = app
