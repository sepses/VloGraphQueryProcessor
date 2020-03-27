var express = require('express');
var router = express.Router();
var Request = require("request");
var SparqlParser = require('sparqljs').Parser;


/* Parse Query. */
router.post('/', function(request, respose, next) { 
	var parser = new SparqlParser();
	var queryString=request.body.queryString;
	//console.log(queryString);
	//process.exit();
	var parsedQuery = parser.parse(queryString);
	respose.send(parsedQuery);
});

module.exports = router;
