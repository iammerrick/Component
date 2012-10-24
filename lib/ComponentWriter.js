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
  // Allow sub classes to mutate before write.
  data = this.process(data);
  file.write(path.join(this.destination, data.path), data.source);
};

ComponentWriter.prototype.process = function(data) {
  return data;
};

module.exports = ComponentWriter;