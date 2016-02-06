var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    enrollment = require('../lib/models/enrollment'),
    fs = require('fs'),
    Config = require('../lib/http/config');

var config, Enrollment;

describe('Enrollment', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Enrollment = enrollment(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#all', function() {

    playback('enrollment/all');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('all');
    });

    it('should get a list of enrollment_npis', function(done) {
      Enrollment.all({
        page: 1,
      })
      .then(function(data) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        expect(data).to.have.property('enrollment_npis');
        expect(data.enrollment_npis[0]).to.be.an.instanceof(Enrollment);
        expect(data.enrollment_npis[0]).to.have.property('id');
        done();
      })
      .catch(done);
    });
  });

  describe('#create', function() {

    playback('enrollment/create');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('create');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Enrollment.create()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            expect(e.response)
            .to.have.property('error', 'enrollment_npi should not be blank.');
            done();
          })
          .catch(done);
      });

    it('should create new enrollment', function(done) {
      Enrollment.create(require('./fixtures/enrollment/enrollment.json'))
      .then(function(enrollment) {
        expect(enrollment).to.be.an.instanceOf(Enrollment);
        expect(enrollment).to.have.property('id');
        done();
      })
      .catch(done);
    });

  });

  describe('#get', function() {

    playback('enrollment/get');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('get');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.get()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should get a enrollment',
      function(done) {
        Enrollment.get('123')
          .then(function(enrollment) {
            expect(enrollment).to.be.an.instanceOf(Enrollment);
            expect(enrollment).to.have.property('id');
            done();
          })
          .catch(done);
      });

  });

  describe('#update', function() {

    playback('enrollment/update');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('update');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.update()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should update a enrollment', function(done) {
      Enrollment.update('123', require('./fixtures/enrollment/enrollment.json'))
      .then(function(enrollment) {
        expect(enrollment).to.be.an.instanceOf(Enrollment);
        expect(enrollment).to.have.property('id');
        done();
      })
      .catch(done);
    });

  });

  describe('#viewReceivedPDF', function() {

    playback('enrollment/viewReceivedPDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('viewReceivedPDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.viewReceivedPDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should get ReceivedPDF',
      function(done) {
        Enrollment.viewReceivedPDF('123')
          .then(function(receivedPDF) {
            expect(receivedPDF).to.be.an.instanceOf(Enrollment.ReceivedPDF);
            expect(receivedPDF).to.have.property('download_url');
            done();
          })
          .catch(done);
      });
  });

  describe('#downloadReceivedPDF', function() {

    playback('enrollment/downloadReceivedPDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('downloadReceivedPDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.downloadReceivedPDF ()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });


    it('should download ReceivedPDF',
      function(done) {
        Enrollment.downloadReceivedPDF('123')
          .then(function(pdf) {
            pdf
              .pipe(
                fs.createWriteStream('./test/fixtures/enrollment/download.pdf')
              )
              .on('error', done)
              .on('finish', done);
          })
          .catch(done);
      });
  });

  describe('#createOriginalSignaturePDF', function() {

    playback('enrollment/createOriginalSignaturePDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('createOriginalSignaturePDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.createOriginalSignaturePDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should create originalSignaturePDF',
      function(done) {
        Enrollment.createOriginalSignaturePDF('123', {
          file: './test/fixtures/enrollment/upload.pdf',
        })
        .then(function(originalSignaturePDF) {
          expect(originalSignaturePDF)
            .to.be.an.instanceOf(Enrollment.OriginalSignaturePDF);
          expect(originalSignaturePDF).to.have.property('download_url');
          done();
        })
        .catch(done);
      });
  });

  describe('#updateOriginalSignaturePDF', function() {

    playback('enrollment/updateOriginalSignaturePDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('updateOriginalSignaturePDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.updateOriginalSignaturePDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should update originalSignaturePDF',
      function(done) {
        Enrollment.updateOriginalSignaturePDF('123', {
          file: './test/fixtures/enrollment/upload.pdf',
        })
        .then(function(originalSignaturePDF) {
          expect(originalSignaturePDF)
            .to.be.an.instanceOf(Enrollment.OriginalSignaturePDF);
          expect(originalSignaturePDF).to.have.property('download_url');
          done();
        })
        .catch(done);
      });
  });

  describe('#viewOriginalSignaturePDF', function() {

    playback('enrollment/viewOriginalSignaturePDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('viewOriginalSignaturePDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.viewOriginalSignaturePDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should view originalSignaturePDF',
      function(done) {
        Enrollment.viewOriginalSignaturePDF('123')
          .then(function(originalSignaturePDF) {
            expect(originalSignaturePDF)
              .to.be.an.instanceOf(Enrollment.OriginalSignaturePDF);
            expect(originalSignaturePDF).to.have.property('download_url');
            done();
          })
          .catch(done);
      });
  });

  describe('#deleteOriginalSignaturePDF', function() {

    playback('enrollment/deleteOriginalSignaturePDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('deleteOriginalSignaturePDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.deleteOriginalSignaturePDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    it('should delete originalSignaturePDF',
      function(done) {
        Enrollment.deleteOriginalSignaturePDF('123')
          .then(function(originalSignaturePDF) {
            expect(originalSignaturePDF)
              .to.have.property('message','Original Signature Pdf deleted');
            done();
          })
          .catch(done);
      });
  });

  describe('#downloadOriginalSignaturePDF', function() {

    playback('enrollment/downloadOriginalSignaturePDF');

    it('exists as public method on Enrollment', function() {
      expect(Enrollment).to.have.property('downloadOriginalSignaturePDF');
    });

    it('should throw InvalidRequestError when no enrollment_npi_id is passed',
      function(done) {
        Enrollment.downloadOriginalSignaturePDF()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    // Getting 404
    it.skip('should download originalSignaturePDF',
      function(done) {
        Enrollment.downloadOriginalSignaturePDF('123')
          .then(function(pdf) {
            pdf
              .pipe(
                fs.createWriteStream('./test/fixtures/enrollment/download2.pdf')
              )
              .on('error', done)
              .on('finish', done);
          })
          .catch(done);
      });
  });

});
