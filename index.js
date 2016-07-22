/*
 * (C) Copyright 2016 o2r project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var c = require('./config/config');
var debug = require('debug')('contentbutler');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

// check fs & create dirs if necessary
var fse = require('fs-extra');
fse.mkdirsSync(c.fs.imgtmp);


mongoose.connect(c.mongo.location + c.mongo.collection);
mongoose.connection.on('error', () => {
  console.log('could not connect to mongodb on ' + c.mongo.location + c.mongo.collection +', ABORT');
  process.exit(2);
});

app.use((req, res, next) => {
  debug(req.method + ' ' + req.path);
  next();
});

controllers = {};
controllers.compendium = require('./controllers/compendium');
controllers.job = require('./controllers/job');

app.get('/api/v1/compendium/:id/data/:path(*)', controllers.compendium.viewPath);
app.get('/api/v1/job/:id/data/:path(*)', controllers.job.viewPath);

app.listen(c.net.port, () => {
  debug('contentbutler '+  c.version.major + '.' + c.version.minor + '.' +
      c.version.bug + ' with api version ' + c.version.api +
      ' waiting for requests on port ' + c.net.port);
});
