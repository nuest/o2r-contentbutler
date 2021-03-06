/*
 * (C) Copyright 2017 o2r project.
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

const debug = require('debug')('resize');
const c = require('../config/config');
const fs = require('fs');
const readline = require('readline');
const exec = require('child_process').exec;
const crypto = require('crypto');

exports.resize = (localpath, size, cb) => {
  debug('resize! %s to %s', localpath, size);
  var deliverpath = '';
  // get file extension from requested file path
  //
  // TODO:
  // This section should probably be reworked in the future to detect the true
  // MIME type of the file content. For now, we have to hope the file extension
  // corresponds to the file type.
  //
  var extension = localpath.split('.');
  extension = extension[extension.length - 1].toLowerCase();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'gif':
    case 'jpeg':
    case 'bmp':
      resizeImage(localpath, size, extension, cb);
      break;
    case 'txt':
    case 'r': // notice toLowerCase
    case 'rmd':
    case 'md':
    case 'markdown':
      truncateText(localpath, size, extension, cb);
      break;
    default:
      cb(localpath);
  }
};

function hashName(localpath, size) {
  var hash = crypto.createHash('sha256');
  hash.update(localpath);
  hash.update(size);
  return hash.digest('hex');
}

function truncateText(localpath, size, extension, cb) {
  if (extension && extension.startsWith('.')) {
    cb(null, 'invalid extension parameter, must not start with a .', 400);
    return;
  }

  if (!isNaN(parseInt(size)) && size > 0) {
    let cached = c.fs.tmp + hashName(localpath, size) + '.' + extension;
    debug('truncate textfile %s to %s lines using tmp file %s', localpath, size, cached);
    try {
      fs.accessSync(cached);
      debug('deliver cached file %s', cached);
      cb(cached);
    } catch (e) {
      // no cached file found, truncate and cache, then deliver
      debug('%s has not been truncated before', localpath);
      //stream input file through readline, abort if read fail
      let readLines = 0;
      let rl = readline.createInterface({
        input: fs.createReadStream(localpath)
      });

      rl.on('line', (line) => {
        // count written lines
        if (readLines < size) {
          // append line to cached file.
          try {
            fs.appendFileSync(cached, line + '\n');
            readLines++;
          } catch (e) {
            fs.unlinkSync(cached);
            throw (e);
          }
        }
      });

      rl.on('close', () => {
        cb(cached);
      });
    }
  } else {
    cb(null, 'invalid size parameter', 400);
  }
}

function resizeImage(localpath, size, extension, cb) {
  // only resize if size parameter is int
  if (!isNaN(parseInt(size)) && size > 0) {
    debug('resize image to %s', size);
    // cache-path for future ref
    var cached = c.fs.tmp + hashName(localpath, size) + '.' + extension;
    // check with filename-hash if has been resized before
    try {
      fs.accessSync(cached);
      debug('deliver cached resized image %s', cached);
      cb(cached);
    } catch (e) {
      // hasn't been resized before
      // resize the image with the `convert` utility from image-magick.
      debug('%s has not been resized before', localpath);
      exec('convert ' + localpath + ' -resize ' + size +
        ' ' + cached, (err, stdout, stderr) => {
          if (err || stderr) {
            debug(err);
            debug(stderr);
            cb(null, new Error('failed resizing'));
          } else {
            debug('deliver newly resized image %s', localpath);
            cb(cached);
          }
        });
    }
  } else {
    cb(null, 'invalid size parameter', 400);
  }
}

exports.resizeImage = resizeImage;
exports.hashName = hashName;
exports.truncateText = truncateText;
