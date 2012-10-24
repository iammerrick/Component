var path = require('path');
var file = require('../../helpers/file');
var util = require('util');
var ComponentWriter = require('../../ComponentWriter');

var HandlebarsWriter = function(destination) {
  ComponentWriter.call(this, destination);
};

util.inherits(HandlebarsWriter, ComponentWriter);

HandlebarsWriter.prototype.process = function(data) {
  // Replace extension with .js
  var filePath = data.path.replace(path.extname(data.path), '.js');
  
  // Partials have an _ that must be removed.
  filePath = filePath.replace(path.basename(filePath), path.basename(filePath).replace(/^_/, ''));
  
  data.path = filePath;
  
  return data;
};

module.exports = HandlebarsWriter;