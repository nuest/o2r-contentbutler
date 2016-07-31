const assert    = require('chai').assert;
const request   = require('request');
const config    = require('../config/config');
const fs        = require('fs');
const host      = 'http://localhost:' + config.net.port;

/*
 *  TODO: prepare example compendium, try loading files, try resizing images, try truncating text
 */
