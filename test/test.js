'use strict';
require('should');
var fs = require('fs');
var path = require('path');
var broccoli = require('broccoli');
var rsvg = require('../');

describe('broccoli-rsvg', function() {
  it('should create a png file throw errors', function(done) {
    var builder = new broccoli.Builder(rsvg('test/svg'));
    builder.build().then(function(results) {
      fs.existsSync(path.join(results.directory, 'test.png')).should.be.true();
      builder.cleanup().then(function() { done(); });
    }).catch(done);
  });
});
