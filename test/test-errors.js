var errors = require('../lib/errors');
var assert = require('chai').assert;

function createsError(key){
  return new errors[key]('foobar');
}
describe('Error', function(){
  before(function() {
    process.env.ELIGIBLE_API_KEY = 'baz'   
    process.env.ELIGIBLE_IS_TEST = 'true';    
  });

  Object.keys(errors).forEach(function(errorClass){

    describe('#' + errorClass, function(){
      var error = createsError(errorClass);

      it('should be instance of Error', function(){
        assert.isTrue(error instanceof Error);
        assert.isTrue(Error.prototype.isPrototypeOf(error));
      });
      it('should be instance of EligibleError', function(){
        assert.isTrue(error instanceof errors.EligibleError);
        assert.isTrue(errors.EligibleError.prototype.isPrototypeOf(error));
      });

      it.skip('should identify as an Error object - [object Error]', function (done) {
        Object.prototype.toString.call(error).should.equal('[object Error]');
      });

      it('should have name of '+ errorClass, function(){
        assert.equal(error.name, errorClass);
      });

      it('should have code of 0', function(){
        assert.equal(error.code, 0);
      });

      it('should have a valid stack trace', function () {
        assert.property(error, 'stack');
        assert.include(error.stack.split('\n')[0], errorClass +': foobar');
        assert.include(error.stack.split('\n')[1], 'createsError');
      });

    });
  })
});
