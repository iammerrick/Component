var glob = require('glob-whatev');
var _ = require('underscore');
var File = require('./lib/helpers/file');
var util = require('util');
var stream = require('stream');
var path = require('path');

module.exports = {
  compile: function(templates, destination, stylesheets, compiler) {
    var ComponentCompiler = require(util.format('./lib/compilers/%s/Compiler', compiler));
    var ComponentWriter = require('./lib/ComponentWriter');
    
    
    /**
     * If stylesheets is passed in, normalize it.
     */
    if (stylesheets) {
      stylesheets = path.normalize(stylesheets)
    }
    
    compiler = new ComponentCompiler(path.normalize(templates), stylesheets, {
      destination: path.normalize(destination)
    });
    var writer = new ComponentWriter(path.normalize(destination));
    
    compiler.pipe(writer);
    compiler.resume();
  }
};