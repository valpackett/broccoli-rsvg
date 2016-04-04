'use strict'

var test = require('tape')
var fs = require('fs')
var path = require('path')
var broccoli = require('broccoli')
var Rsvg = require('../')

test('rsvg', function(t) {
	t.plan(1)
	var builder = new broccoli.Builder(new Rsvg(['test/svg']))
	builder.build().then(function (results) {
		t.ok(fs.existsSync(path.join(results.directory, 'test.png')), 'creates a png file')
	}).catch(t.end).finally(function (_) {
		builder.cleanup()
	})
})
