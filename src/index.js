'use strict';
import config from './config';
import sendMessage from './lib/slackapi';
import localtunnel from './lib/localtunnel';
//import setSchedule from './lib/schedule';

import Express  from 'express';
import BodyParser from 'body-parser';

const app = Express();
const port = process.env.PORT || config.express.port;

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.post(config.express.postURL, function (req, res) { 
    console.log(req.body);
    sendMessage('Received: ' + req.body.text);
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
//   res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});