var util = require('util');
var stream = require('stream');
var path = require('path');
var fs = require('fs');
var file = require('./helpers/file');

var ComponentWriter = function(destination) {
  stream.Stream.call(this);
  this.writable = true;
  this.destination = destination;
};

util.inherits(ComponentWriter, stream.Stream);

ComponentWriter.prototype.write = function(data) {
  // Replace extension with .js
  var filePath = data.path.replace(path.extname(data.path), '.js');
  file.write(path.join(this.destination, filePath), data.source);
};

module.exports = ComponentWriter;