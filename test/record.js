/*
Records nock definitions if not available
*/

var nock = require('nock');
var path = require('path');
var fs = require('fs-extra');

module.exports = function(name, rerecord) {
  rerecord = Boolean(rerecord);

  // Definition path
  var fixturePath = path.join(__dirname, 'fixtures',name + '.json');
  var hasFixture;

  before(function(done) {
    // Check if definition exists and readable
    fs.access(fixturePath, fs.R_OK | fs.R_OK, function(err) {
      if (err || rerecord) {
        // Not found, start recording
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        nock.recorder.rec({
          output_objects:  true,
          dont_print:      true,
        });
      } else {
        // Definitions found, load them

        hasFixture = true;
        var nockDefs = nock.loadDefs(fixturePath);
        nockDefs.forEach(function(def) {
          def.filteringRequestBody = function(body, aRecordedBody) {
            if (aRecordedBody.formData && aRecordedBody.formData.file) {
              // Workaround
              aRecordedBody.formData.file = JSON.parse(JSON.stringify(fs.createReadStream(aRecordedBody.formData.file.path)));
            }
            return body;
          };
        });
        nock.define(nockDefs);
      }
      return done();
    });
  });

  after(function(done) {
    if (hasFixture) {
      return done();
    }
    // Suite finished, save the recorded definitions
    var fixtures = nock.recorder.play();
    nock.restore();
    fs.ensureFile(fixturePath, function(err) {
      if (err) {
        done(err);
      }
      fs.writeFile(fixturePath, JSON.stringify(fixtures, null, 2), done);
    });
  });
};
