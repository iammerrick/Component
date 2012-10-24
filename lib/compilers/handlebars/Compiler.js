var util = require('util');
var stream = require('stream');
var path = require('path');
var file = require('../../helpers/file');
var handlebars = require('handlebars');
var _ = require('underscore');

var SUPPORT_DIRECTORY = path.join(__dirname, 'Support');

var read = function(filePath) {
  var isPartial = path.basename(filePath).match(/^_/) !== null;

  var name = filePath.replace(new RegExp('/', 'g'), '.') // Replace '/' with '.'
    .replace(path.basename(filePath), path.basename(filePath).replace(/^_/, '')) 
    .replace(path.extname(filePath), '') // Remove the extension

  return {
    source : file.read(filePath),
    name: name,
    path: filePath,
    isPartial: isPartial
  };
};

// Sets an array of leveraged partials with dot notation. ['some.partial']
var partials = function(map) {
  var nodes = handlebars.parse(map.source);
  
  function recursiveNodeSearch( statements, res ) {
    statements.forEach(function ( statement ) {
      if ( statement && statement.type === 'partial' ) {
        res.push(statement.id.string);
      }
      if ( statement && statement.program && statement.program.statements ) {
        recursiveNodeSearch( statement.program.statements, res );
      }
      if ( statement && statement.program && statement.program.inverse && statement.program.inverse.statements ) {
        recursiveNodeSearch( statement.program.inverse.statements, res );
      }
    });
    return res;
  }
  
  var res = [];
  
  if ( nodes && nodes.statements ) {
    res = recursiveNodeSearch( nodes.statements, [] );
  }
  
  map.partials = _.unique(res);
  return map;
};


// Merges default dependencies with 
var dependencies = function(map) {

  map.dependencies = _.union(['handlebars'], _.map(map.partials, function(partial) {
    return partial.replace(/\./g, path.sep);
  }));
  
  return map;
};

var compile = function(map) {
  
  var partialTemplate = _.template(file.read(path.join(SUPPORT_DIRECTORY, 'partials.txt')));
  
  map.compiled = handlebars.precompile(map.source);
  
  // If it is a partial register it as such!
  if (map.isPartial) {
    map.compiled += partialTemplate({
      name: map.name
    });
  }
  
  return map;
};

var complete = function(map) {
  var amdTemplate = _.template(file.read(path.join(SUPPORT_DIRECTORY, 'amd.txt')));
  return {
    source: amdTemplate({
      name: map.name,
      compiled: map.compiled,
      dependencies: JSON.stringify(map.dependencies)
    }),
    path: map.path
  };
};


var HandlebarsComponentCompiler = function(templates, destination, stylesheets) {
  stream.Stream.call(this);

  this.templates = file.findAllByExtension(templates, 'handlebars');
};

util.inherits(HandlebarsComponentCompiler, stream.Stream);

HandlebarsComponentCompiler.prototype.resume = function() {
  var emit = function(output) {
    this.emit('data', output);
  }
  // In reverse order of steps.
  var steps = _.compose(emit, complete, compile, dependencies, partials, read);
  this.templates.forEach(steps, this);
};

module.exports = HandlebarsComponentCompiler;