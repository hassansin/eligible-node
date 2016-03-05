var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    x12 = require('../lib/models/x12'),
    Config = require('../lib/http/config');

var config, X12;

describe('X12', function() {

  before(function() {
    config = new Config({
      apiKey: process.env.ELIGIBLE_API_KEY,
      isTest: true,
    });
    config.setApiVersion('v1.1');
    X12 = x12(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#post', function() {

    playback('x12/post');

    it('exists as public method on X12', function() {
      expect(X12).to.have.property('post');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        X12.post()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            expect(e.response).to
              .eql('x12 is required, please correct the request and resubmit.');
            done();
          })
          .catch(done);
      });


    it('should get x12 transaction.', function(done) {
      // jscs:disable maximumLineLength
      X12.post({
        x12: 'ISA*00*          *00*          *ZZ*               *ZZ*RECEIVER       *080319*2327*U*00401*002721171*0*T*:~GS*HC*SENDER*RECEIVER*20080319*2327*27211711*X*004010X096A1~ST*270*1234~BHT*0022*13*10001234*19990501*1319~HL*1**20*1~NM1*PR*2*ABC COMPANY*****PI*842610001~HL*2*1*21*1~NM1*1P*1*AUSTEN*JANE****SV*0202034~HL*3*2*22*0~TRN*1*93175-012547*9877281234~NM1*IL*1*FRANKLIN*BENJAMIN*B***MI*23412342~REF*1L*599119~DMG*D8*19430519*M~DTP*472*D8*19990501~EQ*98**FAM~SE*14*1234~GE*1*27211711~IEA*1*002721171~',
      })
      .then(function(x12) {
        expect(x12).to.match(/^ISA\*00\*/);
        done();
      })
      .catch(done);
    });
    // jscs:enable maximumLineLength
  });

  describe('#mimePost', function() {

    playback('x12/mimePost');

    it('exists as public method on X12', function() {
      expect(X12).to.have.property('mimePost');
    });

    // Skipped because boundary matching issue with nock
    it.skip('should get x12 transaction.', function(done) {
      // jscs:disable maximumLineLength
      X12.mimePost({
        Payload: 'ISA*00*          *00*          *ZZ*               *ZZ*RECEIVER       *080319*2327*U*00401*002721171*0*T*:~GS*HC*SENDER*RECEIVER*20080319*2327*27211711*X*004010X096A1~ST*270*1234~BHT*0022*13*10001234*19990501*1319~HL*1**20*1~NM1*PR*2*ABC COMPANY*****PI*842610001~HL*2*1*21*1~NM1*1P*1*AUSTEN*JANE****SV*0202034~HL*3*2*22*0~TRN*1*93175-012547*9877281234~NM1*IL*1*FRANKLIN*BENJAMIN*B***MI*23412342~REF*1L*599119~DMG*D8*19430519*M~DTP*472*D8*19990501~EQ*98**FAM~SE*14*1234~GE*1*27211711~IEA*1*002721171~',
      })
      .then(function(x12) {
        expect(x12).to.match(/ISA\*00\*/);
        done();
      })
      .catch(done);
      // jscs:enable maximumLineLength
    });
  });

});
