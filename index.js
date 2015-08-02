'use strict'

var fs = require('fs')
var path = require('path')
var CachingWriter = require('broccoli-caching-writer')
var Rsvg = require('librsvg').Rsvg
var RSVP = require('rsvp')
var path = require('path')
var mkdirp = require('mkdirp')
var walkSync = require('walk-sync')
var _ = require('lodash')

var SvgRenderer = CachingWriter.extend({
	init: function(inputTrees, fileOptions) {
		this._super(inputTrees, {})
		this.fileOptions = fileOptions || {}
	},

	promiseForFile: function(srcDir, relativePath, destDir, version) {
		if (typeof version !== 'undefined') {
			var srcPath = path.join(srcDir, relativePath)
			var allPromises = (version['versions'] || []).map(function(v) {
				return this.promiseForFile(srcDir, relativePath, destDir, _.merge(_.omit(version, 'versions'), v))
			}.bind(this))
			allPromises.push(new RSVP.Promise(function(resolve, reject) {
				var destPath = path.join(destDir, version['path'] || getDestFilePath(relativePath))
				mkdirp.sync(path.dirname(destPath))
				render(srcPath, destPath, version, resolve)
			}))
			return RSVP.all(allPromises)
		}
	},

	updateCache: function(srcPaths, destDir) {
		var promises = srcPaths.map(function(srcDir) {
			return RSVP.all(walkSync(srcDir).map(function(relativePath) {
				if (relativePath.slice(-1) === '/') {
					mkdirp.sync(path.join(destDir, relativePath))
				} else {
					var version = this.fileOptions[relativePath] || {}
					return this.promiseForFile.bind(this)(srcDir, relativePath, destDir, version)
				}
			}.bind(this)))
		}.bind(this))
		return RSVP.all(promises)
	}
})

function render(from, to, options, callback) {
	var svg = new Rsvg()
	svg.on('finish', function() {
		fs.writeFile(to, svg.render(_.merge({
			format: 'png',
			width: svg.width,
			height: svg.height
		}, options)).data, callback)
	})
	var transformer = options['transformer']
	fs.readFile(from, {encoding: 'UTF-8'}, function(err, data) {
		if (err) throw err
			if (typeof transformer === 'function') data = transformer(data)
				svg.end(data)
	})
}

function getDestFilePath(relativePath) {
	return relativePath.replace('svg', 'png')
}

module.exports = function(t, o) { return new SvgRenderer(t, o) }
