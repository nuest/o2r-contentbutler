var debug = require('debug')('resize');
var c = require('../config/config');
var fs = require('fs');
var exec = require('child_process').exec;
var crypto = require('crypto');

exports.resize = (localpath, size, cb) => {
  debug('resize! ' + localpath + size );
  var deliverpath = '';
  //get file extension from requested file path
  var extension = localpath.split('.');
  extension = extension[extension.length - 1].toLowerCase();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'gif':
    case 'jpeg':
    case 'bmp':
      // only resize if size parameter is int
      if(parseInt(size) !== NaN ) {
        debug('resize image to ' + size);
        // cache-path for future ref
        var hash = crypto.createHash('sha256');
        hash.update(localpath);
        hash.update(size);
        var hash = hash.digest('hex');
        var cached = c.fs.imgtmp + hash + '.' + extension;
        debug(cached);
        // check with filename-hash if has been resized before
        try {
          fs.accessSync(cached);
          debug('deliver cached resized image ' + cached);
          cb(cached);
        } catch (e) {
          // hasn't been resized before
          debug(localpath + ' has not been resized before');
          exec('convert ' + localpath + ' -resize ' + size +
              ' ' + cached, (err, stdout, stderr) => {
                if (err || stderr) {
                  debug(err);
                  debug(stderr);
                  cb(null, new Error('failed resizing'));
                } else {
                  debug('deliver newly resized image ' + localpath);
                  cb(cached);
                }
              });
        }
        break;
      }
    default:
      cb(localpath, null);
  }
}
