var express = require('express');
var router = express.Router();
var url = require('url');
var Request = require("request");



/* GET users listing. */
router.get('/', function(req, res, next) {
	// var queryString=req.body.queryString;
	// var parsedQuery=req.body.parsedQuery;
	// var startTime=req.body.startTime;
	// var endTime=req.body.endTime;
	//  console.log(queryString);
	//  console.log(parsedQuery);
	var requestURL = "http://localhost:4000"
	  console.log(requestURL);
Request.get(requestURL, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.send(JSON.parse(body));
});

});

module.exports = router;
