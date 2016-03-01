var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    ticket = require('../lib/models/ticket'),
    Config = require('../lib/http/config');

var config, Ticket;

describe('Ticket', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Ticket = ticket(config);
    process.env.NODE_ENV = 'testing';
  });

  describe.skip('#retrieve', function() {

    playback('ticket/retrieve', true);

    it('exists as public method on Ticket', function() {
      expect(Ticket).to.have.property('retrieve');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Ticket.retrieve()
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


    it('should get retrieve a ticket', function(done) {
      Ticket.retrieve('123')
      .then(function(ticket) {
        console.log(ticket);
        done();
      })
      .catch(done);
    });
  });

});
