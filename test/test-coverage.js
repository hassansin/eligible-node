var errors = require('../lib/errors');
var assert = require('chai').assert;
var expect = require('chai').expect;
var record_or_play = require('./record');

var coverage = require('../lib/models/coverage');
var Config = require('../lib/http/config');


var config;
var Coverage;

describe('Coverage', function(){

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true
    });
    Coverage = coverage(config);
  });

  describe('#all', function(){

    record_or_play('coverage/all');

    it('exists as public method on Coverage', function(){
      expect(Coverage).to.have.property('all');
    });

    it('should throw InvalidRequestError when no param is passed', function(done){
      Coverage.all()
        .catch(function(e){
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          done();
        });
    });
    
    it('should fetch coverage', function(done){
      Coverage.all({
        "payer_id":"00001",
        "provider_last_name":"Doe",
        "provider_first_name":"John",
        "provider_npi":"0123456789",
        "member_id":"ZZZ445554301",
        "member_first_name":"IDA",
        "member_last_name":"FRANKLIN",
        "member_dob":"1701-12-12",
        "service_type":"30"
      })
      .then(function(coverage){
        expect(coverage).to.be.an.instanceOf(Coverage);
        done();
      });
    });

  });
});
