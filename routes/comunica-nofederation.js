var express = require('express');
var router = express.Router();
const cors = require('cors');
var comunica = require('@comunica/actor-init-sparql');
const engine = comunica.newEngine();

router.use(cors());
router.post('/', (req, res, next) => {
    var queryString=req.body.queryString;
    var endpoint=req.body.endpoint;
    //console.log(endpoint);
    var bgk=req.body.bgk;
    var bgk_tpf=req.body.bgk_tpf;
    
        //add endpoint
        if(endpoint!=""){
           
            var ep=endpoint.split(",");
                const results=[];
                 for(var k=0;k<ep.length;k++){
           
               
                handleData(queryString,ep[k],bgk,bgk_tpf).then(result => {
                    console.log("======batas========");
                    console.log(result);
                    results.push(result);
                   
                    
                });

        }
        console.log(results);
        res.set('content-type', 'text/plain; charset=utf-8');
        res.send(results);
 
        

}      

});


async function handleData (queryString,endpoint,bgk,bgk_tpf) {
    const query = queryString;
   const sources = [ ];
    
   sources.push({ type:"sparql", value:endpoint });
    //add bgk to source
     
    if(bgk!=""){
       var bgks=bgk.split(",");
       bgks.forEach(bgksFunction);
       function bgksFunction(item) {
        sources.push({ type:"sparql", value:item });
       }
    }
    
    if(bgk_tpf!=""){
        var bgk_tpfs=bgk_tpf.split(",");    
            for(var j=0;j<bgk_tpfs.length;j++){
                sources.push({ type:"hypermedia", value:bgk_tpfs[j] });
            }
        
    }
    
    console.log(sources);
 /*original implementation*/
    const result = await engine.query(query, { sources });
    const results = [];
   
    result.bindingsStream.on('data', (data) =>// {
        //console.log(data.toObject()));
          results.push(data.toObject()));        
    //});
    return new Promise(resolve => {
        result.bindingsStream.on('end', () => {
            resolve(results);
        })
    });
   
}
module.exports = router;