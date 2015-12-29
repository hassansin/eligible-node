/*
Records nock definitions if not available
*/

var nock = require('nock');
var path = require('path');
var fs = require('fs-extra');

var nock = require('nock');

module.exports = function(fixture_name) {
  //Definition path
  var fixture_path = path.join(__dirname, 'fixtures',fixture_name + '.json');
  var has_fixture;

  before(function(done) {
    //Check if definition exists and readable
    fs.access(fixture_path, fs.R_OK | fs.R_OK, function(err) {
      if (err) {
        //Not found, start recording
        nock.recorder.rec({
          output_objects:  true,
          dont_print:      true,
        });
      } else {
        //Definitions found, load them
        has_fixture = true;
        nock.load(fixture_path);
      }
      return done();
    });
  });

  after(function(done) {
    if (has_fixture) {
      return done();
    }

    //Suite finished, save the recorded definitions
    fixtures = nock.recorder.play();
    fs.ensureFile(fixture_path, function(err) {
      if (err) {
        done(err);
      }
      fs.writeFile(fixture_path, JSON.stringify(fixtures, null, 2), done);
    });
  });
};
