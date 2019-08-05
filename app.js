const express = require('express');
const app = express();
const allRestRouter = require('./scripts/allRestRouter.js');
const allPageRouter = require('./scripts/allPageRouter.js');


app.use('/rest',allRestRouter);
app.use('/',allPageRouter);

console.log('Server started');

app.listen(3000);
