'use strict';
var fs = require('fs');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');
var Rsvg = require('librsvg').Rsvg;
var RSVP = require('rsvp');
var path = require('path');
var mkdirp = require('mkdirp');
var walkSync = require('walk-sync');
var _ = require('lodash');

function SvgRenderer(inputTree, fileOptions) {
  if (!(this instanceof SvgRenderer)) return new SvgRenderer(inputTree, fileOptions);
  CachingWriter.apply(this, arguments)
  this.fileOptions = fileOptions || {};
}

SvgRenderer.prototype = Object.create(CachingWriter.prototype);
SvgRenderer.prototype.constructor = SvgRenderer;

function render(from, to, options, callback) {
  var svg = new Rsvg();
  svg.on('finish', function() {
    fs.writeFile(to, svg.render(_.merge({
      format: 'png',
      width: svg.width,
      height: svg.height
    }, options)).data, callback);
  });
  var transformer = options['transformer'];
  fs.readFile(from, {encoding: 'UTF-8'}, function(err, data) {
    if (err) throw err;
    if (typeof transformer === 'function') data = transformer(data);
    svg.end(data);
  });
}

function getDestFilePath(relativePath) {
  return relativePath.replace('svg', 'png');
}

SvgRenderer.prototype.promiseForFile = function(srcDir, relativePath, destDir, version) {
  if (typeof version !== 'undefined') {
    var self = this;
    var srcPath = path.join(srcDir, relativePath);
    var allPromises = (version['versions'] || []).map(function(v) {
      return self.promiseForFile(srcDir, relativePath, destDir, _.merge(_.omit(version, 'versions'), v));
    });
    allPromises.push(new RSVP.Promise(function(resolve, reject) {
      var destPath = path.join(destDir, version['path'] || getDestFilePath(relativePath));
      mkdirp.sync(path.dirname(destPath));
      render(srcPath, destPath, version, resolve);
    }));
    return RSVP.all(allPromises);
  }
}

SvgRenderer.prototype.updateCache = function(srcPaths, destDir) {
  var self = this;
  var promises = srcPaths.map(function(srcDir) {
    return RSVP.all(walkSync(srcDir).map(function(relativePath) {
      if (relativePath.slice(-1) === '/') {
        mkdirp.sync(path.join(destDir, relativePath));
      } else {
        var version = self.fileOptions[relativePath] || {};
        return self.promiseForFile.bind(self)(srcDir, relativePath, destDir, version);
      }
    }));
  });
  return RSVP.all(promises);
}

module.exports = SvgRenderer;
