
var Eligible = require('../lib/eligible');

var eligible = Eligible();

eligible.Payer.retrieve(62308)
.then(function(payer){
    console.log(payer)
})
.catch(Eligible.APIConnectionError, function(e){
    console.log('Connection Error');
})
.catch(Eligible.AuthenticationError, function(e){
    console.log('Authentication Error', e.message, e.code);
})
.catch(function(e){
	console.log(e);
});
