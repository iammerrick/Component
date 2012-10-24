var globber = require('glob-whatev');
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

var File = {
  findAllByExtension: function(directory, extension) {
    return globber.glob(util.format('%s/**/*.%s', directory, extension));
  },
  
  read: function(path) {
    return fs.readFileSync(path, 'utf8');
  },
  
  write: function(filePath, contents) {
    mkdirp.sync(path.dirname(filePath), '0755');
    fs.writeFileSync(filePath, contents);
  }
};


module.exports = File;