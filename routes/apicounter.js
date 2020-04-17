var express = require('express');
var router = express.Router();
var Request = require("request");
var fs = require("fs");


/* Parse Query. */
router.post('/', function(request, respose, next) { 
    var urisize=request.body.urisize;
    //console.log(urisize);
   
        //write to file
        fs.readFile(__dirname +"/apicounter.txt", function(err, buf) {
            var currCounter =parseInt(buf);
            var newCounter=currCounter+1;
        fs.writeFile(__dirname +"/apicounter.txt", newCounter, (err) => {
            if (err) console.log(err);
            console.log("add counter 1 to file:"+newCounter);
            if(newCounter==urisize){
                console.log("restart from 0");
            fs.writeFile(__dirname +"/apicounter.txt", 0, (err) => {
                if (err) console.log(err);
              });
              respose.send("complete");     
            }else{
                respose.send("notcomplete");
            }
          });
        });
    
		
});

module.exports = router;
