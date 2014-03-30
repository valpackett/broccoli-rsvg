'use strict';
var fs = require('fs');
var path = require('path');
var Transform = require('broccoli-transform');
var Rsvg = require('rsvg').Rsvg;
var RSVP = require('rsvp');
var path = require('path');
var mkdirp = require('mkdirp');
var walkSync = require('walk-sync');
var _ = require('lodash');

function SvgRenderer(inputTree, fileOptions) {
  if (!(this instanceof SvgRenderer)) return new SvgRenderer(inputTree, fileOptions);
  this.inputTree = inputTree;
  this.fileOptions = fileOptions || {};
}

SvgRenderer.prototype = Object.create(Transform.prototype)
SvgRenderer.prototype.constructor = SvgRenderer;

function render(from, to, options, callback) {
  var svg = new Rsvg();
  svg.on('finish', function() {
    fs.writeFileSync(to, svg.render(_.merge({
      format: 'png',
      width: svg.width,
      height: svg.height
    }, options)).data);
    callback();
  });
  fs.createReadStream(from).pipe(svg);
}

SvgRenderer.prototype.getDestFilePath = function(relativePath) {
  return relativePath.replace('svg', 'png');
}

SvgRenderer.prototype.promiseForFile = function(srcDir, relativePath, destDir) {
  var self = this;
  var srcPath = path.join(srcDir, relativePath);
  var versions = ((self.fileOptions[relativePath] || {})['versions'] || []).map(function(version) {
    return new RSVP.Promise(function(resolve, reject) {
      var destPath = path.join(destDir, version['path']);
      mkdirp.sync(path.dirname(destPath));
      render(srcPath, destPath, version, resolve);
    });
  });
  versions.push(new RSVP.Promise(function(resolve, reject) {
    var destPath = path.join(destDir, self.getDestFilePath(relativePath));
    mkdirp.sync(path.dirname(destPath));
    render(srcPath, destPath, self.fileOptions[relativePath], resolve);
  }));
  return RSVP.all(versions);
}

SvgRenderer.prototype.transform = function(srcDir, destDir) {
  var self = this;
  var promises = walkSync(srcDir).map(function(relativePath) {
    if (relativePath.slice(-1) === '/') {
      mkdirp.sync(path.join(destDir, relativePath));
    } else {
      return self.promiseForFile.bind(self)(srcDir, relativePath, destDir);
    }
  });
  return RSVP.all(promises);
}

module.exports = SvgRenderer;
