var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    customer = require('../lib/models/customer'),
    Config = require('../lib/http/config');

var config, Customer;

describe('Customer', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Customer = customer(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#all', function() {

    playback('customer/all');

    it('exists as public method on Customer', function() {
      expect(Customer).to.have.property('all');
    });

    it('should get a list of customers', function(done) {
      Customer.all({
        page: 1,
      })
      .then(function(data) {
        expect(data).to.have.property('customers');
        expect(data.customers[0]).to.be.an.instanceof(Customer);
        expect(data.customers[0]).to.have.property('name');
        done();
      })
      .catch(done);
    });
  });

  describe('#create', function() {

    playback('customer/create');

    it('exists as public method on Customer', function() {
      expect(Customer).to.have.property('create');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Customer.create()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            expect(e.response)
            .to.have.property('error', 'customer should not be blank.');
            done();
          })
          .catch(done);
      });

    it('should throw InvalidRequestError when invalid customer is passed',
      function(done) {
        Customer.create({
          customer: 'foo',
        })
        .then(function() {
          // Success, where we were expecting an error - test should fail
          done(new Error('Expecting InvalidRequestError, got 200'));
        })
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          expect(e.code).to.eql(400);
          expect(e.response)
            .to.have.property('error', 'customer name should not be blank.');
          done();
        })
        .catch(done);
      });

    it('should create new customer', function(done) {
      Customer.create({
        customer: {
          name: 'ABC company',
        },
      })
      .then(function(customer) {
        expect(customer).to.be.an.instanceOf(Customer);
        expect(customer).to.have.property('id');
        expect(customer).to.have.property('name', 'ABC company');
        done();
      })
      .catch(done);
    });

  });

  describe('#get', function() {

    playback('customer/get');

    it('exists as public method on Customer', function() {
      expect(Customer).to.have.property('get');
    });

    it('should throw InvalidRequestError when no customer_id is passed',
      function(done) {
        Customer.get()
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

    it('should get a customer',
      function(done) {
        Customer.get('TN344YY67HH09KK')
          .then(function(customer) {
            expect(customer).to.be.an.instanceOf(Customer);
            expect(customer).to.have.property('id');
            done();
          })
          .catch(done);
      });

  });

  describe('#update', function() {

    playback('customer/update');

    it('exists as public method on Customer', function() {
      expect(Customer).to.have.property('update');
    });

    it('should throw InvalidRequestError when no customer_id is passed',
      function(done) {
        Customer.update()
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

    it('should throw InvalidRequestError when invalid customer is passed',
      function(done) {
        Customer.update('TN344YY67HH09KK')
        .then(function() {
          // Success, where we were expecting an error - test should fail
          done(new Error('Expecting InvalidRequestError, got 200'));
        })
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          expect(e.code).to.eql(400);
          expect(e.response)
            .to.have.property('error', 'customer should not be blank.');
          done();
        })
        .catch(done);
      });

    it('should update a customer', function(done) {
      Customer.update('TN344YY67HH09KK', {
        customer: {
          name: 'XYZ company',
        },
      })
      .then(function(customer) {
        expect(customer).to.be.an.instanceOf(Customer);
        expect(customer).to.have.property('id');
        done();
      })
      .catch(done);
    });

  });

});
