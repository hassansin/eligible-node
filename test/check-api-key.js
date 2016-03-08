before(function(){
  if(!process.env.ELIGIBLE_API_KEY){
    throw new Error("Error: No API Key provide.\nProvide an API key using environment variable: 'ELIGIBLE_API_KEY=foobar npm test'");
  }
});