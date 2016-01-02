var Config = require('./http/config');
var errors = require('./errors');

function Eligible(config) {
  if (!(config instanceof Config)) {
    config = new Config(config);
  }
  var eligible = {
    config: config,
    Payer: require('./models/payer')(config),
    Coverage: require('./models/coverage')(config),
  };
  return eligible;
}

Eligible.Config = Config;
Object.keys(errors).forEach(function(errorType) {
  Eligible[errorType] = errors[errorType];
});

module.exports = Eligible;
